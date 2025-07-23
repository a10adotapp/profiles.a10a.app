import { PrismaClient } from "@/prisma/generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { styleText } from "node:util";

const verboseLog = false as const;

const prismaClientSingleton = () => {
  const prismaClient = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

  prismaClient.$on("query", (event) => {
    if (verboseLog) {
      console.log([
        styleText("bgRed", "QUERY"),
        styleText("red", event.query),
        styleText("bgBlue", "PARAMS"),
        styleText("blue", event.params),
        styleText("bgGray", "DURATION"),
        styleText("gray", `${event.duration.toFixed(0)}ms`),
      ].join(" "));
    }
  });

  return prismaClient.$extends(withAccelerate());
};

const globalForPrisma = global as unknown as {
  prisma: PrismaClient,
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
