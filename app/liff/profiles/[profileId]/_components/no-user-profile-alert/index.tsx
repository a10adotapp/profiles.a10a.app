"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { toggleUserProfile } from "./_actions/toggle-user-profile";

export function NoUserProfileAlert({
  profileId,
}: {
  profileId: string;
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
    <Alert>
      <AlertCircleIcon />
      <AlertTitle>
        名刺入れに無い名刺です
      </AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-2 w-full">
          <div>
            名刺入れに追加すると、後からいつでもこの名刺を確認できます。
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={isBusy}
              onClick={handleClick}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg text-white font-bold">
              名刺入れに追加する
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
