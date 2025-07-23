import { appUrl } from "@/lib/env/app-url";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";
import { Agent, Runner } from "@openai/agents";
import z from "zod";

export async function POST() {
  try {
    const profile = await prisma.profile.findFirst({
      where: {
        deletedAt: null,
        analyzeStartedAt: null,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
    });

    if (!profile) {
      return Response.json({
        message: "ok",
      });
    }

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        analyzeStartedAt: new Date(),
      },
    });

    const agent = new Agent({
      name: "Profile Image Analyzer",
      model: "gpt-4.1-mini-2025-04-14",
      instructions: [
        "これから名刺の画像を裏表それぞれ１枚ずつアップロードします。",
        "社員情報と会社情報を読み取ってください。",
        "日本語以外の表記がある場合、日本語表記を優先してください。",
        "自信がないものはNULLとしてください。",
        "-----",
        "# output",
        "- name",
        "  - 社員名",
        "  - 例",
        "    - 田中 太郎",
        "- phoneticName",
        "  - 社員名（ふりがな）",
        "  - 例",
        "    - たなか たろう",
        "    - Taro Tanaka",
        "- department",
        "  - 部署名",
        "  - 例",
        "    - システム管理部",
        "    - 経理課",
        "- jobTitle",
        "  - 役職名",
        "  - 例",
        "    - ディレクター",
        "    - 執行役員",
        "- phoneNumber",
        "  - 電話番号",
        "  - FAX番号は不要です",
        "  - 例",
        "    - 06-1234-5678",
        "- email",
        "  - メールアドレス",
        "  - 例",
        "    - tarou.tanaka@example.com",
        "- companyName",
        "  - 会社名",
        "  - 例",
        "    - 株式会社あべのシステムソリューション",
        "- companyAddress",
        "  - 会社住所",
        "  - 例",
        "    - 〒100-8111 東京都千代田区千代田1-1",
      ].join("\n"),
      outputType: z.object({
        name: z.string().nullable(),
        phoneticName: z.string().nullable(),
        department: z.string().nullable(),
        jobTitle: z.string().nullable(),
        phoneNumber: z.string().nullable(),
        email: z.string().nullable(),
        companyName: z.string().nullable(),
        companyAddress: z.string().nullable(),
      }),
    });

    const runner = new Runner({
      traceMetadata: {
        profileId: profile.id,
      },
    });

    const result = await runner.run(agent, [
      {
        role: "user",
        content: [
          {
            type: "input_image",
            image: [
              appUrl(),
              profile.frontImageUri,
            ].join(""),
          },
          {
            type: "input_image",
            image: [
              appUrl(),
              profile.backImageUri,
            ].join(""),
          },
        ],
      },
    ]);

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        name: result.finalOutput?.name || null,
        phoneticName: result.finalOutput?.phoneticName || null,
        department: result.finalOutput?.department || null,
        jobTitle: result.finalOutput?.jobTitle || null,
        phoneNumber: result.finalOutput?.phoneNumber || null,
        email: result.finalOutput?.email || null,
        companyName: result.finalOutput?.companyName || null,
        companyAddress: result.finalOutput?.companyAddress || null,
        analyzeEndedAt: new Date(),
      },
    });
  } catch (err) {
    serverError({
      action: "api.profiles.analyze.POST",
      data: {
        error: err,
      },
    });
  }

  return Response.json({
    message: "ok",
  });
}
