"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile } from "@/prisma/generated/client";

export async function createProfile(data: {
  frontImageUri: string;
  backImageUri: string;
}): Promise<Profile> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    const profile = await prisma.profile.create({
      data: {
        postedBy: session.user.id,
        frontImageUri: data.frontImageUri,
        backImageUri: data.backImageUri,
      },
    });

    await prisma.userProfile.create({
      data: {
        userId: session.user.id,
        profileId: profile.id,
      },
    });

    return profile;
  } catch (err) {
    serverError({
      action: "uploadImage",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}
