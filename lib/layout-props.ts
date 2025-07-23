import { ReactNode } from "react";

export type LayoutProps = {
  params: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
  children: ReactNode;
};
