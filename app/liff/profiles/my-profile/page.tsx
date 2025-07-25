import { ProfileAnalyzeResultTable } from "@/components/profile-analyze-result-table";
import { ProfilesTab } from "@/components/profiles/profiles-tab";
import Image from "next/image";
import { getProfileCached } from "./_actions/get-profile";
import { MyProfileToggleButton } from "./_components/my-profile-toggle-button";
import { QrCodeButton } from "./_components/qr-code-button";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profile = await getProfileCached();

  return (
    <div className="flex flex-col gap-4 p-4">
      <ProfilesTab current="my-profile" />

      {!profile && (
        <div>
          自分の名刺は登録されていません
        </div>
      )}

      {profile && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 justify-end">
            <div className="flex items-center gap-2">
              <QrCodeButton
                profileId={profile.id} />

              <MyProfileToggleButton
                profileId={profile.id} />
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

          {profile.analyzeEndedAt && (
            <div className="w-full max-w-md border rounded-lg shadow-lg overflow-hidden">
              <ProfileAnalyzeResultTable profile={profile} />
            </div>
          )}
        </div>
      )}
    </div>

  );
}
