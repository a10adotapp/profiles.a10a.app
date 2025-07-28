"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import { imagesSchema } from "@/lib/user-profile-note/images-schema";
import prisma from "@/prisma";

export async function createUserProfileNote(data: {
  userProfileId: string;
  body: string;
  images: {
    uri: string;
  }[];
}): Promise<void> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    const userProfile = await prisma.userProfile.findFirstOrThrow({
      where: {
        deletedAt: null,
        id: data.userProfileId,
        userId: session.user.id,
      },
    });

    const images = imagesSchema.parse(data.images);

    await prisma.userProfileNote.create({
      data: {
        userId: session.user.id,
        profileId: userProfile.profileId,
        userProfileId: userProfile.id,
        body: data.body,
        images,
      },
    });
  } catch (err) {
    serverError({
      action: "createUserProfileNote",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}
