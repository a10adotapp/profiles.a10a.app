"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleMyProfile } from "./_actions/toggle-my-profile";

export function MyProfileToggleButton({
  profileId,
}: {
  profileId: string;
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isBusy}
          className="flex items-center">
          <User />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            自分の名刺として登録されています
          </AlertDialogTitle>
          <AlertDialogDescription>
            あなたの名刺ではないですか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            私の名刺です
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            私の名刺ではありません
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
