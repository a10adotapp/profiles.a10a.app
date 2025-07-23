"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserProfile } from "@/prisma/generated/client";
import { IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleMyProfile } from "./_actions/toggle-my-profile";

export function MyProfileToggleItem({
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
      await toast.promise(toggleMyProfile({
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

  if (userProfile?.isMyProfile) {
    return null;
  }

  return (
    <DropdownMenuItem
      disabled={isBusy}
      onClick={handleClick}
      className="flex items-center gap-2">
      <IdCard />
      自分の名刺として登録する
    </DropdownMenuItem>
  );
}
