import Link from "next/link";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <body>
        <div className="relative flex flex-col gap-12 min-h-svh">
          <div className="flex-1">
            {children}
          </div>

          <div className="p-6 bg-gray-900">
            <div className="flex flex-col gap-4">
              <div className="text-xs text-gray-100 font-bold">
                かんたん名刺交換
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="https://lin.ee/rRTZwYk"
                  className="text-xs text-gray-100">
                  お問合せ
                </Link>

                <Link
                  href="/docs/terms-of-service"
                  className="text-xs text-gray-100">
                  利用規約
                </Link>

                <Link
                  href="/docs/privacy-policy"
                  className="text-xs text-gray-100">
                  プライバシーポリシー
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
