"use server";

import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile } from "@/prisma/generated/client";
import { cache } from "react";

export async function getProfile(id: string): Promise<Profile> {
  try {
    return await prisma.profile.findFirstOrThrow({
      where: {
        deletedAt: null,
        id,
      },
    });
  } catch (err) {
    serverError({
      action: "getProfile",
      data: {
        error: err,
        id,
      },
    });

    throw err;
  }
}

export const getProfileCached = cache(getProfile);
