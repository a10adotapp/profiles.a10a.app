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

          <div className="p-6 bg-gray-900"></div>
        </div>

        <Toaster />
      </body>
    </html>
  );
}
