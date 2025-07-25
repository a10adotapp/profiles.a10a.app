"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile, UserProfile } from "@/prisma/generated/client";
import { cache } from "react";

export async function getProfile(id: string): Promise<Profile & {
  userProfiles: UserProfile[];
}> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    return await prisma.profile.findFirstOrThrow({
      include: {
        userProfiles: {
          where: {
            deletedAt: null,
            userId: session.user.id,
          },
          take: 1,
        },
      },
      where: {
        deletedAt: null,
        id,
      },
    });
  } catch (err) {
    serverError({
      action: "getProfile",
      data: {
        error: err,
        id,
      },
    });

    throw err;
  }
}

export const getProfileCached = cache(getProfile);
