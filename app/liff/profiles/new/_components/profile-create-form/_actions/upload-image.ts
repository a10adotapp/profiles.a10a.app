"use server";

import { auth } from "@/lib/auth";
import { publicDirname } from "@/lib/env/public-dirname";
import { serverError } from "@/lib/log/server";
import { createHash } from "node:crypto";
import sharp from "sharp";

export async function uploadImage(data: {
  imageData: string;
}): Promise<string> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    const imageContent = data.imageData.replace(/^[^;]+;base64,/, "");

    let s = sharp(Buffer.from(imageContent, "base64"));

    const { width, height, format } = await s.metadata();

    if (width && height) {
      if (width > 1024 || height > 1024) {
        s = s.resize({
          ...(width >= height ? {
            width: 1024,
          } : {}),
          ...(height >= width ? {
            height: 1024,
          } : {}),
        });
      }
    }

    const filePath = [
      "/upload/profiles",
      `/${createHash("md5").update(data.imageData).digest("hex")}.${format}`,
    ].join("");

    await s.toFile([
      publicDirname(),
      filePath,
    ].join(""));

    return [
      "/assets",
      filePath,
    ].join("");
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
