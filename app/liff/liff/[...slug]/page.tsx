import { PageProps, parseSearchParams } from "@/lib/page-props";
import { redirect } from "next/navigation";
import path from "node:path";
import { z } from "zod";

const paramsSchema = z.object({
  slug: z.array(z.string()),
});

export default async function Page(props: PageProps) {
  const params = paramsSchema.parse(await props.params);

  const searchParams = await props.searchParams;

  return redirect([
    "/liff",
    `/${path.join(...params.slug)}`,
    `?${parseSearchParams(searchParams)}`,
  ].join(""));
}
