import { LiffTopTab } from "@/components/profiles/liff-top-tab";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { listUserProfileCached } from "./_actions/list-user-profile";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userProfiles = await listUserProfileCached();

  return (
    <div className="relative flex flex-col gap-4 p-4">
      <LiffTopTab current="profiles-owned" />

      {(userProfiles.length === 0) && (
        <div>
          自分の名刺がありません
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {userProfiles.map((userProfile) => (
          <Link
            key={userProfile.id}
            href={`/liff/profiles/owned/${userProfile.profile.id}`}>
            <div className="w-full aspect-square rounded-lg shadow-lg bg-gray-400 overflow-hidden">
              <Image
                src={userProfile.profile.frontImageUri}
                alt="frontImage"
                width={512}
                height={512}
                className="h-full w-full object-contain" />
            </div>
          </Link>
        ))}
      </div>

      <div
        className="sticky bottom-0 z-10 flex justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 2em)",
        }}>
        <Button
          asChild
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg text-white font-bold">
          <Link href="/liff/profiles/owned/new">
            自分の名刺を追加する
          </Link>
        </Button>
      </div>
    </div>
  );
}
