import { LiffTopTab } from "@/components/profiles/liff-top-tab";
import { auth } from "@/lib/auth";
import { UserUpdateForm } from "./_components/user-update-form";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-4 p-4">
      <LiffTopTab current="settings" />

      <div className="w-full p-4 max-w-md rounded-lg shadow-lg">
        {session?.user && (
          <UserUpdateForm user={session.user} />
        )}
      </div>
    </div>
  );
}
