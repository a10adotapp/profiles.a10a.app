"use client";

import liff, { type Liff } from "@line/liff";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, use, useEffect, useState } from "react";
import { signIn } from "./_actions/sign-in";

type ContextValue = {
  liff: Liff | null;
  error: Error | null;
};

const defaultContextValue: ContextValue = {
  liff: null,
  error: null,
};

const Context = createContext<ContextValue>(defaultContextValue);

export function useLiffContext() {
  return use(Context);
}

export function LiffContextProvider({
  session,
  liffId,
  children,
}: {
  session: Session | null;
  liffId: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const [liffInstance, setLiffInstance] = useState<ContextValue["liff"]>(null);

  const [error, setError] = useState<ContextValue["error"]>(null);

  useEffect(() => {
    liff.init({ liffId })
      .then(async () => {
        setLiffInstance(liff);

        if (session) {
          return;
        }

        if (error) {
          return;
        }

        const liffContext = liff.getContext();

        const userId = liffContext?.userId;

        if (!userId) {
          setError(new Error("failed to get context"));

          return;
        }

        const signInResult = await signIn({
          lineUserId: userId,
        });

        if (!signInResult) {
          throw new Error("LINEユーザー認証に失敗しました。");
        }

        router.refresh();
      })
      .catch((error) => {
        setError(error);
      });
  }, [error, liffId, router, session]);

  return (
    <Context value={{
      liff: liffInstance,
      error,
    }}>
      {error && (
        error.message
      )}

      {(liffInstance && !error) && children}
    </Context>
  );
}
