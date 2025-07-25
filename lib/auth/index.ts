import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { User as PrismaUser } from "@/prisma/generated/client";
import NextAuth from "next-auth";
import "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { headers } from "next/headers";
import z from "zod";

declare module "next-auth" {
  interface Session {
    user: PrismaUser;
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
  }
}

const credentialsSchema = z.object({
  type: z.literal("LiffContext"),
  lineUserId: z.string(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  jwt: {
    maxAge: 60 * 60 * 24 * 1,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1,
    updateAge: 60 * 60 * 1,
  },
  providers: [
    Credentials({
      credentials: {
        authName: {},
        authPassword: {},
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = credentialsSchema.parse(credentials);

          if (parsedCredentials.type === "LiffContext") {
            const user = await getOrCreateUser({
              lineUserId: parsedCredentials.lineUserId,
            });

            return {
              id: user.id,
            };
          }

          throw new Error("unexpected credentials type");
        } catch (err) {
          serverError({
            action: "NextAuth.providers.Credentials.authorize",
            data: {
              error: err,
              credentials,
            },
          });
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({
      trigger,
      user: authUser,
      token,
    }) => {
      if (trigger === "signIn") {
        const userId = z.string().cuid2().parse(authUser.id);

        const user = await getUser(userId);

        if (!user) {
          throw new Error("no user found");
        }

        return {
          ...token,
          sub: user.id,
        };
      }

      if (trigger === undefined) {
        return token;
      }

      throw new Error("unhandled trigger");
    },
    session: async ({
      token,
      session: authSession,
    }) => {
      const user = await getUser(token.sub);

      if (!user) {
        throw new Error("no user found");
      }

      createSession({
        userId: user.id,
      });

      return {
        ...authSession,
        user,
      };
    },
  },
});

async function getUser(id: string): Promise<PrismaUser | null> {
  try {
    return await prisma.user.findFirst({
      where: {
        deletedAt: null,
        id,
      },
    });
  } catch (err) {
    serverError({
      action: "",
      data: {
        error: err,
        id,
      },
    });

    return null;
  }
}

async function getOrCreateUser(data: {
  lineUserId: string;
}) {
  const user = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      lineUserId: data.lineUserId,
    },
  });

  if (user) {
    return user;
  }

  return await prisma.user.create({
    data: {
      lineUserId: data.lineUserId,
    },
  });
}

async function createSession(data: {
  userId: string;
}) {
  const {
    get: getHeader,
  } = await headers();

  const ipAddress = getHeader("x-forwarded-for");

  const userAgent = getHeader("user-agent");

  const session = await prisma.session.findFirst({
    where: {
      deletedAt: null,
      userId: data.userId,
      ipAddress,
      userAgent,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  if (session) {
    return;
  }

  prisma.session.create({
    data: {
      userId: data.userId,
      location: getHeader("x-pathname") || "",
      ipAddress,
      userAgent,
    },
  });
}
