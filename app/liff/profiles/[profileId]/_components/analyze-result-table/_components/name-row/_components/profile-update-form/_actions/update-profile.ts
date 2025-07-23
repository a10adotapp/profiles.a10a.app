"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile } from "@/prisma/generated/client";

export async function updateProfile(id: string, data: {
  name: string;
}): Promise<Profile> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    const profile = await prisma.profile.findFirstOrThrow({
      where: {
        deletedAt: null,
        id,
      },
    });

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        name: data.name,
      },
    });

    return profile;
  } catch (err) {
    serverError({
      action: "updateProfile",
      data: {
        ...data,
        error: err,
        id,
      },
    });

    throw err;
  }
}
