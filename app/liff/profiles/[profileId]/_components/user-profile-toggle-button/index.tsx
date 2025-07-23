"use client";

import { Button } from "@/components/ui/button";
import { UserProfile } from "@/prisma/generated/client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleUserProfile } from "./_actions/toggle-user-profile";

export function UserProfileToggleButton({
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
    <Button
      variant="outline"
      size="sm"
      disabled={isBusy}
      onClick={handleClick}
      className="flex items-center">
      {userProfile ? (
        <Heart stroke="red" fill="red" />
      ) : (
        <Heart stroke="gray" />
      )}
    </Button>
  );
}
