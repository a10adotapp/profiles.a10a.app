import { Button } from "@/components/ui/button";

import { AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PageProps } from "@/lib/page-props";
import { imagesSchema } from "@/lib/user-profile-note/images-schema";
import { format } from "@formkit/tempo";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { MD5 } from "crypto-js";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import z from "zod";
import { getProfileCached } from "./_actions/get-profile";
import { getUserProfileCached } from "./_actions/get-user-profile";
import { MenuButton } from "./_components/menu-button";
import { NoUserProfileAlert } from "./_components/no-user-profile-alert";
import { UserProfileNoteCreateForm } from "./_components/user-profile-note-create-form";

const paramsSchema = z.object({
  profileId: z.string().cuid2(),
});

export default async function Page(props: PageProps) {
  const params = paramsSchema.parse(await props.params);

  const profile = await getProfileCached(params.profileId);

  const userProfile = await getUserProfileCached({
    profileId: profile.id,
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4 justify-between">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center">
          <Link href="/liff/profiles">
            <ChevronLeft />
            名刺入れへ
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {userProfile && (
            <MenuButton profileId={profile.id} />
          )}
        </div>
      </div>

      {!userProfile && (
        <NoUserProfileAlert profileId={profile.id} />
      )}

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

      {userProfile && (
        <div className="w-full p-4 max-w-md rounded-lg shadow-lg">
          <UserProfileNoteCreateForm userProfileId={userProfile.id} />
        </div>
      )}

      {userProfile?.notes.map((userProfileNote) => {
        const images = imagesSchema.parse(userProfileNote.images);

        return (
          <div
            key={userProfileNote.id}
            className="w-full p-4 max-w-md rounded-lg shadow-lg">
            <div className="flex flex-col gap-0">
              <div className="text-sm font-bold">
                {format({
                  date: userProfileNote.createdAt,
                  format: "YYYY/MM/DD HH:mm",
                  tz: "Asia/Tokyo",
                })}
              </div>

              <div className="whitespace-pre">
                {userProfileNote.body}
              </div>

              <div className="grid grid-cols-3 gap-[1px]">
                {images.map(({ uri }, imageIndex) => (
                  <AlertDialog key={MD5(`${imageIndex}:${uri}`).toString()}>
                    <AlertDialogTrigger asChild>
                      <div className="aspect-square bg-gray-400">
                        <Image
                          src={uri}
                          alt="image"
                          width={512}
                          height={512}
                          className="h-full w-full object-contain" />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          添付画像
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <div className="rounded-lg bg-gray-400 overflow-hidden">
                        <Image
                          src={uri}
                          alt="image"
                          width={512}
                          height={512}
                          className="h-full w-full object-cover" />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          閉じる
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
