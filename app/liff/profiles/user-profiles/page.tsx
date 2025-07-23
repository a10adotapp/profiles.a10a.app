import { ProfilesTab } from "@/components/profiles/profiles-tab";
import Image from "next/image";
import Link from "next/link";
import { listProfileCached } from "./_actions/list-profile";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profiles = await listProfileCached();

  return (
    <div className="flex flex-col gap-4 p-4">
      <ProfilesTab current="user-profiles" />

      <div className="grid grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <Link
            key={profile.id}
            href={`/liff/profiles/${profile.id}`}>
            <div className="w-full aspect-square rounded-lg shadow-lg bg-gray-400 overflow-hidden">
              <Image
                src={profile.frontImageUri}
                alt="frontImage"
                width={512}
                height={512}
                className="h-full w-full object-contain" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
