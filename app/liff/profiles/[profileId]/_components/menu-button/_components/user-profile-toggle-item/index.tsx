"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserProfile } from "@/prisma/generated/client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleUserProfile } from "./_actions/toggle-user-profile";

export function UserProfileToggleItem({
  profileId,
  userProfile,
}: {
  profileId: string;
  userProfile: UserProfile | null;
}) {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const handleClick = useCallback(async () => {
    setIsBusy(true);

    try {
      await toast.promise(toggleUserProfile({
        profileId,
      }), {
        loading: "保存中...",
        success: "保存しました！",
        error: "保存できませんでした、、、",
      });

      router.refresh();
    } finally {
      setIsBusy(false);
    }
  }, [profileId, router]);

  return (
    <DropdownMenuItem
      disabled={isBusy}
      onClick={handleClick}
      className="flex items-center">
      {userProfile ? (
        <div className="flex items-center gap-2">
          <Heart stroke="red" fill="red" />
          名刺入れから取り出す
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Heart stroke="gray" />
          名刺入れに入れる
        </div>
      )}
    </DropdownMenuItem>
  );
}
