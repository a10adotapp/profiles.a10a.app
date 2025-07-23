"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile } from "@/prisma/generated/client";
import { cache } from "react";

export async function listProfile(): Promise<Profile[]> {
  try {
    const session = await auth();

    if (!session) {
      return [];
    }

    const profiles = await prisma.profile.findMany({
      include: {
        userProfiles: {
          where: {
            deletedAt: null,
            userId: session.user.id,
            isMyProfile: true,
          },
        },
      },
      where: {
        deletedAt: null,
        userProfiles: {
          some: {
            deletedAt: null,
            userId: session.user.id,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 100,
    });

    const myProfileIndex = profiles.findIndex((profile) => {
      return profile.userProfiles.some((userProfile) => (userProfile.isMyProfile));
    });

    if (myProfileIndex > 0) {
      const profile = profiles[myProfileIndex];

      profiles.splice(myProfileIndex, 1);
      profiles.splice(0, 0, profile);
    }

    return profiles;
  } catch (err) {
    serverError({
      action: "listProfile",
      data: {
        error: err,
      },
    });

    throw err;
  }
}

export const listProfileCached = cache(listProfile);
