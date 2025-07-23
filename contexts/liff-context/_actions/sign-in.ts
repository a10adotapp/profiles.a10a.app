"use server";

import { signIn as authSignIn } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import { CredentialsSignin } from "next-auth";

export async function signIn(data: {
  lineUserId: string;
}): Promise<boolean> {
  try {
    await authSignIn("credentials", {
      type: "LiffContext",
      lineUserId: data.lineUserId,
      redirect: false,
    });

    return true;
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      // invalid credentials
      return false;
    }

    serverError({
      action: "signIn",
      data: {
        ...data,
        error: err,
      },
    });
  }

  return false;
}
