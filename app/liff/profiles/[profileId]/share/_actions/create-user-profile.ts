"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";

export async function createUserProfile(data: {
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
      return;
    }

    await prisma.userProfile.create({
      data: {
        userId: session.user.id,
        profileId: data.profileId,
        isShared: true,
      },
    });
  } catch (err) {
    serverError({
      action: "createUserProfile",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}
