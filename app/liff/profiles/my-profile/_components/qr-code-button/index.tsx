"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { MouseEvent as ReactMouseEvent, useCallback, useRef, useState } from "react";
import { getQrCodeUrlCached } from "./_actions/get-qr-code";

export function QrCodeButton({
  profileId,
}: {
  profileId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const qrCodeCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleAlertDialogOpenChange = useCallback(async (isOpen: boolean) => {
    if (isOpen && !qrCodeUrl) {
      setQrCodeUrl(await getQrCodeUrlCached({ profileId }));
    }

    setIsOpen(isOpen);
  }, [profileId, qrCodeUrl]);

  const handleAlertDialogActionClick = useCallback(async (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (qrCodeCanvasRef.current) {
      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        if (!qrCodeCanvasRef.current) {
          return reject(new Error("no canvas found"));
        }

        qrCodeCanvasRef.current.toBlob((blob) => {
          if (!blob) {
            return reject(new Error("empty blob"));
          }

          return resolve(blob);
        }, "image/jpeg");
      });

      const file = new File([imageBlob], "qrcode.jpg", {
        type: "image/jpeg",
      });

      navigator.share({
        text: "QRコード",
        files: [file],
      });
    }
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={handleAlertDialogOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center">
          <QrCode />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            QRコード
          </AlertDialogTitle>
          <AlertDialogDescription>
            あなたの名刺をシェアできます！
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center items-center p-4">
          {qrCodeUrl && (
            <QRCodeCanvas
              ref={qrCodeCanvasRef}
              value={qrCodeUrl}
              size={120} />
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>
            閉じる
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAlertDialogActionClick}>
            ダウンロード
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
