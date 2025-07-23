import { LiffContextProvider } from "@/contexts/liff-context";
import { auth } from "@/lib/auth";
import { lineLiffId } from "@/lib/env/line-liff-id";
import { Metadata, Viewport } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "かんたん名刺交換",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <LiffContextProvider
      liffId={lineLiffId()}
      session={session}>
      {children}
    </LiffContextProvider>
  );
}
