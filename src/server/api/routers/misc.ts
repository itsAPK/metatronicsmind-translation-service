/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { LANGUAGES } from "~/utils/constants";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { z } from "zod";
import { translateAndUploadBlob } from "~/server/azure-utils/upload-to-blob";
import { env } from "~/env";
import {
  senRejectMail,
  sendApproveddMail,
  sendReviewMail,
} from "~/utils/email";
import JWT from "jsonwebtoken";
export const miscRouter = createTRPCRouter({
  getLanguages: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.language.findMany({ orderBy: { pricePerWord: "asc" } });
  }),

  getFile: publicProcedure
    .input(
      z.object({
        file: z.string({ required_error: "Name should not be empty" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.file);
      return input;
    }),
  translate: protectedProcedure
    .input(
      z.object({
        blobUrl: z.string(),
        fileName: z.string(),
        totalAmount: z.number(),
        totalWords: z.number(),
        input: z.array(
          z.object({
            blobUrl: z.string(),
            language: z.string(),
            blobName: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      console.log(ctx.session.user);
      const translations = [];
      const info = await ctx.db.translationInfo.create({
        data: {
          blobLink: input.blobUrl,
          fileName: input.fileName,
          totalWords: input.totalWords,
          totalAmount: input.totalAmount,
          user: { connect: { id: ctx.session.user.userId } },
        },
        include: {
          user: true,
        },
      });
      try {
        for (const i of input.input) {
          await translateAndUploadBlob(i.blobName, i.language, i.blobUrl);
          const tanslation = await ctx.db.translatedFiles.create({
            data: {
              totalWords: input.totalWords,
              language: { connect: { code: i.language } },
              file: `${env.AZURE_BLOB_STORAGE_URL}/${env.AZURE_TRANSLATOR_CONTAINER_NAME}/${i.blobName}`,
              translationInfo: { connect: { id: info.id } },
            },
            include: { language: true },
          });
          const token: string = JWT.sign(
            { translationId: tanslation.id, for: "REVISE" },
            env.JWT_SECRET,
          );

          translations.push({ ...tanslation, reviseToken: token });
        }

        const approveToken: string = JWT.sign(
          { translationId: info.id, for: "APPROVE" },
          env.JWT_SECRET,
        );

        const rejectToken: string = JWT.sign(
          { translationId: info.id, for: "REJECT" },
          env.JWT_SECRET,
        );

        await sendReviewMail({
          user: info.user,
          info: info,
          files: translations,
          approveLink: `https://ai-translation.metatronicmind.ai/admin/approve?token=${approveToken}`,
          rejectLink: `https://ai-translation.metatronicmind.ai/admin/reject?token=${rejectToken}`,
        });

        return { suceess: true, data: info };
      } catch (e) {
        console.log(e);
        return { suceess: false };
      }
    }),
  revise: publicProcedure
    .input(
      z.object({
        token: z.string({ required_error: "Token should not be empty" }),
        file: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const data: any = JWT.verify(input.token, env.JWT_SECRET);
        if (data.for !== "REVISE") {
          throw new Error("Invalid Token");
        }
        const revised = await ctx.db.translatedFiles.update({
          where: { id: data.translationId },
          data: {
            file: input.file,
          },
        });
        return revised;
      } catch (e: any) {
        throw new Error(e);
      }
    }),
  approve: publicProcedure
    .input(
      z.object({
        token: z.string({ required_error: "Token should not be empty" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const data: any = JWT.verify(input.token, env.JWT_SECRET);
        if (data.for !== "APPROVE") {
          throw new Error("Invalid Token");
        }
        const a = await ctx.db.translationInfo.update({
          where: { id: data.translationId },
          data: {
            status: "APPROVED",
          },
          include: { user: true },
        });
        await sendApproveddMail({
          email: a.user.email,
          fileName: a.fileName,
          link: a.blobLink,
          name: a.user.name,
        });
        return a;
      } catch (e: any) {
        throw new Error(e);
      }
    }),
  reject: publicProcedure
    .input(
      z.object({
        token: z.string({ required_error: "Token should not be empty" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const data: any = JWT.verify(input.token, env.JWT_SECRET);
        if (data.for !== "REJECT") {
          throw new Error("Invalid Token");
        }
        const r = await ctx.db.translationInfo.update({
          where: { id: data.translationId },
          data: {
            status: "REJECTED",
          },
          include: { user: true },
        });
        await senRejectMail({
          email: r.user.email,
          fileName: r.fileName,
          link: r.blobLink,
          name: r.user.name,
        });
        return r;
      } catch (e: any) {
        throw new Error(e);
      }
    }),
});
