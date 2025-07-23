import { z } from "zod";

const envSchema = z.object({
  LINE_LIFF_ID: z.string().min(1),
});

export function lineLiffId(): string {
  return envSchema.parse(process.env).LINE_LIFF_ID;
}
