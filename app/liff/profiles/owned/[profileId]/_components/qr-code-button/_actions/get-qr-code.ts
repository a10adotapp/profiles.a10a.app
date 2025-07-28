"use server";

import { lineMiniappUrl } from "@/lib/env/line-miniapp-url";
import { serverError } from "@/lib/log/server";
import { cache } from "react";

export async function getQrCodeUrl(data: {
  profileId: string;
}): Promise<string> {
  try {
    return [
      lineMiniappUrl(),
      `/liff/profiles/${data.profileId}/share`,
    ].join("");
  } catch (err) {
    serverError({
      action: "getQrCode",
      data: {
        ...data,
        error: err,
      },
    });

    throw err;
  }
}

export const getQrCodeUrlCached = cache(getQrCodeUrl);
