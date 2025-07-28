import { Button } from "@/components/ui/button";
import { PageProps } from "@/lib/page-props";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { getProfileCached } from "./_actions/get-profile";
import { getUserProfileCached } from "./_actions/get-user-profile";
import { MenuButton } from "./_components/menu-button";
import { QrCodeButton } from "./_components/qr-code-button";

const paramsSchema = z.object({
  profileId: z.string().cuid2(),
});

export default async function Page(props: PageProps) {
  const params = paramsSchema.parse(await props.params);

  const profile = await getProfileCached(params.profileId);

  const userProfile = await getUserProfileCached({
    profileId: profile.id,
  });

  if (!userProfile) {
    return "名刺が見つかりませんでした";
  }

  if (!userProfile.isOwned) {
    return "自分の名刺ではありません";
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 justify-between">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex items-center">
            <Link href="/liff/profiles/owned">
              <ChevronLeft />
              自分の名刺へ
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <QrCodeButton profileId={profile.id} />

            <MenuButton profileId={profile.id} />
          </div>
        </div>

        <div className="w-full max-w-md rounded-lg shadow-lg bg-gray-400 overflow-hidden">
          <Image
            src={profile.frontImageUri}
            alt="frontImage"
            width={512}
            height={512}
            className="h-full w-full object-contain" />
        </div>

        <div className="w-full max-w-md rounded-lg shadow-lg bg-gray-400 overflow-hidden">
          <Image
            src={profile.backImageUri}
            alt="backImage"
            width={512}
            height={512}
            className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}
