"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";

export async function toggleMyProfile(data: {
  profileId: string;
}): Promise<void> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    const profile = await prisma.userProfile.findFirst({
      where: {
        deletedAt: null,
        userId: session.user.id,
        profileId: data.profileId,
      },
    });

    if (profile) {
      await prisma.userProfile.update({
        where: {
          id: profile.id,
        },
        data: {
          isMyProfile: false,
        },
      });
    }
  } catch (err) {
    serverError({
      action: "toggleMyProfile",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}
