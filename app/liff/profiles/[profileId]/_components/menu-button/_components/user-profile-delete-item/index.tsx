"use client";

import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { deleteUserProfile } from "./_actions/delete-user-profile";

export function UserProfileDeleteItem({
  profileId,
  setAlertDialogContent,
}: {
  profileId: string;
  setAlertDialogContent: (content: ReactNode) => void;
}) {
  const router = useRouter();

  const [isBusy, setIsBusy] = useState(false);

  const handleAlertDialogActionClick = useCallback(async () => {
    setIsBusy(true);

    try {
      await toast.promise(deleteUserProfile({
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

  const handleMenuItemClick = useCallback(async () => {
    setAlertDialogContent(
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            名刺入れから破棄
          </AlertDialogTitle>
          <AlertDialogDescription>
            名刺入れから破棄すると、後からこの名刺を確認できなくなります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            破棄しない
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAlertDialogActionClick}
            className="bg-destructive">
            名刺入れから破棄する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  }, [handleAlertDialogActionClick, setAlertDialogContent]);

  return (
    <>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          disabled={isBusy}
          onClick={handleMenuItemClick}
          className="flex items-center">
          <Trash2 />
          名刺入れから破棄する
        </DropdownMenuItem>
      </AlertDialogTrigger>
    </>
  );
}
