import { z } from "zod";

const envSchema = z.object({
  LINE_MINIAPP_URL: z.string().min(1),
});

export function lineMiniappUrl(): string {
  return envSchema.parse(process.env).LINE_MINIAPP_URL;
}
