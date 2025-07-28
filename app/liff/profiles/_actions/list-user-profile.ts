"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile, UserProfile } from "@/prisma/generated/client";
import { cache } from "react";

export async function listUserProfile(): Promise<
  (UserProfile & {
    profile: Profile;
  })[]
> {
  try {
    const session = await auth();

    if (!session) {
      return [];
    }

    const userProfiles = await prisma.userProfile.findMany({
      include: {
        profile: true,
      },
      where: {
        deletedAt: null,
        userId: session.user.id,
        isOwned: false,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return userProfiles;
  } catch (err) {
    serverError({
      action: "listUserProfile",
      data: {
        error: err,
      },
    });

    throw err;
  }
}

export const listUserProfileCached = cache(listUserProfile);
