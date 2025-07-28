import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { z } from "zod";

const requestDataSchema = z.object({
  action: z.string(),
  data: z.record(z.any()),
});

export async function POST(request: Request) {
  const data = await request.json();

  console.error(data);

  const session = await auth();

  const requestData = requestDataSchema.safeParse(data);

  if (requestData.data) {
    prisma.errorLog.create({
      data: {
        userId: session?.user.id,
        action: requestData.data.action,
        data: requestData.data.data,
      },
    });
  }

  return Response.json({
    message: "ok",
  });
}
