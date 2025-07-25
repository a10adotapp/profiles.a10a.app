import { z } from "zod";

const envSchema = z.object({
  LINE_MESSAGING_API_USER_ID: z.string().min(1),
});

export function lineMessagingApiUserId(): string {
  return envSchema.parse(process.env).LINE_MESSAGING_API_USER_ID;
}
