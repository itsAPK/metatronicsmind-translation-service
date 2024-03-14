/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import {
  type AuthUser,
  jwtHelper,
  tokenOneDay,
  tokenOnWeek,
} from "~/utils/jwt-helper";

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      type : 'credentials',
      async authorize(credentials) {
        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });

          if (user && credentials) {
            const validPassword = await bcrypt.compare(
              credentials?.password,
              user.password,
            );

            if (validPassword) {
              return {
                id: user.id,
                name: user.name,
              };
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
      credentials: {
        email: {
          label: "E-mail",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // credentials provider:  Save the access token and refresh token in the JWT on the initial login
      if (user) {
        const authUser = { user: user } as AuthUser;

        const accessToken = await jwtHelper.createAcessToken(authUser);
        const refreshToken = await jwtHelper.createRefreshToken(authUser);
        const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
        const refreshTokenExpired = Date.now() / 1000 + tokenOnWeek;

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpired,
          refreshTokenExpired,
          user: authUser,
        };
      } else {
        if (token) {
          // In subsequent requests, check access token has expired, try to refresh it
          if (Date.now() / 1000 > token.accessTokenExpired!) {
            const verifyToken = await jwtHelper.verifyToken(
              token.refreshToken!,
            );

            if (verifyToken) {
              const user = await db.user.findFirst({
                where: {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                  email: token.user.email,
                },
              });

              if (user) {
                const accessToken = await jwtHelper.createAcessToken({
                  user: token.user,
                });
                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

                return { ...token, accessToken, accessTokenExpired };
              }
            }

            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          name: token.user.name,
          userId: token.user.id,
        };
      }
      session.error = token.error;
      return session;
    
    },
  },
};
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};