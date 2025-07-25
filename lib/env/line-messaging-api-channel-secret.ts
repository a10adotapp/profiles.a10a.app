import { z } from "zod";

const envSchema = z.object({
  LINE_MESSAGING_API_CHANNEL_SECRET: z.string().min(1),
});

export function lineMessagingApiChannelSecret(): string {
  return envSchema.parse(process.env).LINE_MESSAGING_API_CHANNEL_SECRET;
}
