import { z } from "zod";

export const imagesSchema = z.array(
  z.object({
    uri: z.string(),
  }),
);
