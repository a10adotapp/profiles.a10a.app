"use server";

import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Profile } from "@/prisma/generated/client";
import { cache } from "react";

export async function listProfile(): Promise<Profile[]> {
  try {
    return await prisma.profile.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 100,
    });
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
