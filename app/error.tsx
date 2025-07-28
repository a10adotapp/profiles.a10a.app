"use client";

import { Button } from "@/components/ui/button";
import { clientError } from "@/lib/log/client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & {
    digest?: string | undefined;
  };
  reset?: () => void;
}) {
  useEffect(() => {
    clientError({
      action: "Error",
      data: {
        error,
      },
    });
  }, [error]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 p-4 w-full max-w-md border border-destructive rounded-lg shadow-lg shadow-destructive/25">
        <div className="text-destructive font-bold">
          エラーが発生しました、、、
        </div>

        <Button
          variant="outline"
          onClick={reset}>
          ページを再読み込み
        </Button>
      </div>
    </div>
  );
}
