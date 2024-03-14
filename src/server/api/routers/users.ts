import { z } from "zod";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { SALTROUNDS } from "~/utils/constants";
import { User } from "@prisma/client";
import { env } from "~/env";
import { senResetPasswordMail } from "~/utils/email";

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
        const a =await senResetPasswordMail({
          email: user.email,
          name: user.name,
          subject: "RestPassword",
          link: `http://localhost:3000/auth/reset-password?token=${token}`,
        });
        console.log(a)
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
});
