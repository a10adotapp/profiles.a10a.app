import { lineMessagingApiChannelSecret } from "@/lib/env/line-messaging-api-channel-secret";
import { lineMessagingApiUserId } from "@/lib/env/line-messaging-api-user-id";
import { createHmac } from "node:crypto";
import { z } from "zod";

const requestDataSchema = z.object({
  destination: z.string(),
});

export async function POST(request: Request) {
  const rawRequestData = await request.text();

  const signature = createHmac("SHA256", lineMessagingApiChannelSecret())
    .update(rawRequestData)
    .digest("base64");

  if (signature !== request.headers.get("x-line-signature")) {
    return Response.json({
      message: "invalid signature",
    }, {
      status: 400,
    });
  }

  const requestData = requestDataSchema.parse(JSON.parse(rawRequestData));

  if (requestData.destination !== lineMessagingApiUserId()) {
    return Response.json({
      message: "unexpected destination",
    }, {
      status: 400,
    });
  }

  return Response.json({
    message: "ok",
  });
}
