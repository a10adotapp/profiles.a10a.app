import { auth } from "@/lib/auth";
import prisma from "@/prisma";

export async function serverError({
  action,
  data,
}: {
  action: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}) {
  console.error({
    action,
    data,
  });

  const session = await auth();

  prisma.errorLog.create({
    data: {
      userId: session?.user.id,
      action,
      data: data,
    },
  });
}
