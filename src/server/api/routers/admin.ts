/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LANGUAGES } from "~/utils/constants";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";
import { env } from "process";
import { data } from "tailwindcss/defaultTheme";
import { z } from "zod";
import { sendApproveddMail, senRejectMail } from "~/utils/email";

export const adminRouter = createTRPCRouter({
  addLanguages: adminProcedure.query(async ({ ctx, input }) => {
    console.log(ctx.session.user);
    return await ctx.db.language.createMany({
      data: LANGUAGES,
      skipDuplicates: true,
    });
  }),
  getRecentFiles: adminProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.translationInfo.findMany({
      take: 20,
      include: {
        TranslatedFiles: {
          include: {
            language: true,
          },
        },
        PaymentHistory: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),
  approve: adminProcedure
    .input(
      z.object({
        translationId: z.string({
          required_error: "Token should not be empty",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const a = await ctx.db.translationInfo.update({
          where: { id: input.translationId },
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
  reject: adminProcedure
    .input(
      z.object({
        translationId: z.string({
          required_error: "Token should not be empty",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const r = await ctx.db.translationInfo.update({
          where: { id: input.translationId },
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
  getLanguages: adminProcedure.query(async ({ ctx, input }) => {
    console.log(ctx.session.user);
    return await ctx.db.language.findMany({
      select: {
        code: true,
        pricePerWord: true,
        name: true,
        id: true,
        _count: {
          select: {
            TranslatedFiles: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }),
  getUsers: adminProcedure.query(async ({ ctx, input }): Promise<any> => {
    return await await ctx.db.$queryRaw`
   SELECT 
    "User"."id", 
    "User"."email", 
    "User"."name", 
    "User"."createAt", 
    COUNT(CASE WHEN "TranslationInfo"."status" = 'APPROVED' THEN 1 END) AS "approvedCount",
    COUNT(CASE WHEN "TranslationInfo"."status" = 'UNDER_REVIEW' THEN 1 END) AS "underReviewCount",
    COUNT(CASE WHEN "TranslationInfo"."status" = 'REJECTED' THEN 1 END) AS "rejectedCount",
    COUNT("TranslationInfo"."id") AS "totalTranslationCount"
FROM 
    "User"
LEFT JOIN 
    "TranslationInfo" ON "User"."id" = "TranslationInfo"."userId"
WHERE 
    "User"."role" = 'INDIVIDUAL'
GROUP BY 
    "User"."id", "User"."email", "User"."name", "User"."createAt"
ORDER BY 
    "User"."createAt" DESC;

`;
  }),
  getOrganizations: adminProcedure.query(
    async ({ ctx, input }): Promise<any> => {
      return await ctx.db.$queryRaw`
         SELECT 
           "User"."id", 
           "User"."email", 
           "User"."name", 
           "User"."createAt", 
           "TranslationInfo"."status",
           "TranslationInfo"."id" AS "translationId",
           "Discount"."discount" AS "discount",
           (SELECT COUNT(*) FROM "TranslationInfo" WHERE "TranslationInfo"."userId" = "User"."id" AND "TranslationInfo"."status" = 'APPROVED') AS "approvedCount",
           (SELECT COUNT(*) FROM "TranslationInfo" WHERE "TranslationInfo"."userId" = "User"."id" AND "TranslationInfo"."status" = 'UNDER_REVIEW') AS "underReviewCount",
           (SELECT COUNT(*) FROM "TranslationInfo" WHERE "TranslationInfo"."userId" = "User"."id" AND "TranslationInfo"."status" = 'REJECTED') AS "rejectedCount",
           (SELECT COUNT(*) FROM "TranslationInfo" WHERE "TranslationInfo"."userId" = "User"."id") AS "totalTranslationCount"

         FROM 
           "User"
         LEFT JOIN 
           "TranslationInfo" ON "User"."id" = "TranslationInfo"."userId"
         LEFT JOIN 
           "Discount" ON "User"."id" = "Discount"."userId"
         WHERE 
           "User"."role" = 'ORGANIZATION'
         GROUP BY 
           "User"."id", "User"."email", "User"."name", "User"."createAt", "TranslationInfo"."status", "TranslationInfo"."id", "Discount"."id"
         ORDER BY 
           "User"."createAt" DESC;
      `;
    },
  ),

  editLanguagePrice: adminProcedure
    .input(
      z.object({
        id: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.language.update({
        where: { id: input.id },
        data: {
          pricePerWord: input.price,
        },
      });
    }),

  giveDiscount: adminProcedure
    .input(
      z.object({
        id: z.string(),
        discount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First, try to find an existing discount for the user
      const existingDiscount = await ctx.db.discount.findUnique({
        where: { userId: input.id },
      });

      if (existingDiscount) {
        // If a discount exists, update it
        return await ctx.db.discount.update({
          where: { id: existingDiscount.id },
          data: { discount: input.discount },
        });
      } else {
        // If no discount exists, create a new one
        return await ctx.db.discount.create({
          data: {
            user: { connect: { id: input.id } },
            discount: input.discount,
          },
        });
      }
    }),
});
