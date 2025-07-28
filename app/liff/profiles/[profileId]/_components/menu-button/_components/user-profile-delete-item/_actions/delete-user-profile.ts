"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";

export async function deleteUserProfile(data: {
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

    if (!profile) {
      return;
    }

    await prisma.userProfile.update({
      where: {
        id: profile.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (err) {
    serverError({
      action: "deleteUserProfile",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}
