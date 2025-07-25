"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile } from "@/prisma/generated/client";
import { cache } from "react";

export async function getProfile(): Promise<Profile | null> {
  try {
    const session = await auth();

    if (!session) {
      return null;
    }

    return await prisma.profile.findFirst({
      where: {
        deletedAt: null,
        userProfiles: {
          some: {
            deletedAt: null,
            userId: session.user.id,
            isMyProfile: true,
          },
        },
      },
    });
  } catch (err) {
    serverError({
      action: "getProfile",
      data: {
        error: err,
      },
    });

    throw err;
  }
}

export const getProfileCached = cache(getProfile);
