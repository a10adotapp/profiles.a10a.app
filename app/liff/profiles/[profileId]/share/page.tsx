import { PageProps } from "@/lib/page-props";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createUserProfile } from "./_actions/create-user-profile";
import { getProfileCached } from "./_actions/get-profile";

const paramsSchema = z.object({
  profileId: z.string().cuid2(),
});

export default async function Page(props: PageProps) {
  const params = paramsSchema.parse(await props.params);

  const profile = await getProfileCached(params.profileId);

  if (profile.userProfiles.length > 0) {
    return redirect(`/liff/profiles/${params.profileId}`);
  }

  await createUserProfile({
    profileId: profile.id,
  });

  return redirect(`/liff/profiles/${params.profileId}`);
}
