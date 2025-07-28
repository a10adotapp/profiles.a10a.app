"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { UserProfile } from "@/prisma/generated/client";
import { cache } from "react";

export async function getUserProfile(data: {
  profileId: string;
}): Promise<UserProfile | null> {
  try {
    const session = await auth();

    if (!session) {
      return null;
    }

    return await prisma.userProfile.findFirst({
      where: {
        deletedAt: null,
        userId: session.user.id,
        profileId: data.profileId,
      },
    });
  } catch (err) {
    serverError({
      action: "getUserProfile",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}

export const getUserProfileCached = cache(getUserProfile);
