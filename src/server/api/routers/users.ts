/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import Razorpay from "razorpay";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { SALTROUNDS } from "~/utils/constants";
import { User } from "@prisma/client";
import { env } from "~/env";
import { senResetPasswordMail } from "~/utils/email";
import moment from "moment";
import cuid from "cuid";
export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string({ required_error: "Name should not be empty" }),
        email: z
          .string({ required_error: "Email Should not be empty" })
          .email("Invalid E-mail"),
        role: z.enum(["INDIVIDUAL", "ORGANIZATION"], {
          required_error: "Role should not be empty",
        }),
        password: z.string({ required_error: "Password required" }).min(8),
        gstin: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const password = bcrypt.hashSync(input.password, SALTROUNDS);
        return await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            role: input.role,
            password: password,
            gstin: input.gstin,
          },
        });
      } catch (e) {
        throw e;
      }
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z
          .string({ required_error: "Email Should not be empty" })
          .email("Invalid E-mail"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user: User | null = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (!user) {
          throw new Error("User not exist");
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const token: string = JWT.sign({ id: user.id }, env.JWT_SECRET);
        const a = await senResetPasswordMail({
          email: user.email,
          name: user.name,
          subject: "RestPassword",
          link: `http://localhost:3000/auth/reset-password?token=${token}`,
        });
        return {
          url: `http://localhost:3000/auth/reset-password?token=${token}`,
        };
      } catch (e) {
        throw e;
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string({ required_error: "Password required" }).min(8),
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id: any = JWT.verify(input.token, env.JWT_SECRET);
        console.log(id);
        const user: User | null = await ctx.db.user.findUnique({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { id: id.id },
        });

        if (!user) {
          throw new Error("User not exist");
        }

        const password = bcrypt.hashSync(input.password, SALTROUNDS);

        const updatedUser = await ctx.db.user.update({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          where: { id: id.id },
          data: { password: password },
          select: {
            email: true,
            name: true,
            role: true,
            id: true,
          },
        });

        return updatedUser;
      } catch (e) {
        throw e;
      }
    }),
  getApporvedFiles: protectedProcedure.query(async ({ ctx, input }) => {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();

    return await ctx.db.translationInfo.findMany({
      where: {
        user: { id: ctx.session.user.userId },
        status: "APPROVED",
        createdAt: {
          gt: thirtyDaysAgo,
        },
      },

      include: {
        TranslatedFiles: {
          include: {
            language: true,
          },
        },
        PaymentHistory: true,
      },
    });
  }),
  getRejectedFiles: protectedProcedure.query(async ({ ctx, input }) => {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();

    return await ctx.db.translationInfo.findMany({
      where: {
        user: { id: ctx.session.user.userId },
        status: "REJECTED",
        createdAt: {
          gt: thirtyDaysAgo,
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        blobLink: true,
        createdAt: true,
        fileName: true,
        totalAmount: true,
        totalWords: true,
        id: true,

        _count: {
          select: {
            TranslatedFiles: true,
          },
        },
      },
    });
  }),
  getUnderReviewFiles: protectedProcedure.query(async ({ ctx, input }) => {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();

    return await ctx.db.translationInfo.findMany({
      where: {
        user: { id: ctx.session.user.userId },
        status: "UNDER_REVIEW",
        createdAt: {
          gt: thirtyDaysAgo,
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        blobLink: true,
        createdAt: true,
        fileName: true,
        totalAmount: true,
        totalWords: true,
        id: true,

        _count: {
          select: {
            TranslatedFiles: true,
          },
        },
      },
    });
  }),
  getExpiredFiles: protectedProcedure.query(async ({ ctx, input }) => {
    const thirtyDaysAgo = moment().subtract(30, "days").toDate();
    return await ctx.db.translationInfo.findMany({
      where: {
        user: { id: ctx.session.user.userId },
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        createdAt: true,
        fileName: true,
        totalAmount: true,
        totalWords: true,
        id: true,
        _count: {
          select: {
            TranslatedFiles: true,
          },
        },
      },
    });
  }),

  createOrder: protectedProcedure
    .input(
      z.object({
        translationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const translation = await ctx.db.translationInfo.findUnique({
        where: { id: input.translationId },
      });
      const razorpay = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });

      const discount = await ctx.db.discount.findUnique({
        where: { userId: ctx.session.user.userId },
      });

      let amount = (translation?.totalAmount ?? 100) * 100;

      if (discount) {
        amount =
          (((translation?.totalAmount ?? 100) * Number(discount.discount)) /
            100) *
          100;
      }

      const createOrder = await razorpay.orders.create({
        payment_capture: true,
        amount: amount,
        currency: "INR",
        receipt: cuid(),
      });
      return { key: env.RAZORPAY_KEY_ID, ...createOrder };
    }),

  addPayment: protectedProcedure
    .input(
      z.object({
        translationId: z.string(),
        orderId: z.string(),
        paymentId: z.string(),
        signature: z.string(),
        recipet: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.paymentHistory.create({
        data: {
          orderId: input.orderId,
          amount: input.amount,
          paymentId: input.paymentId,
          recipet: input.recipet,
          signature: input.signature,
          translation: { connect: { id: input.translationId } },
          user: { connect: { id: ctx.session.user.userId } },
        },
      });
    }),
});
