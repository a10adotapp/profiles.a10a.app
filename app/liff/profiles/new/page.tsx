import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProfileCreateForm } from "./_components/profile-create-form";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center">
          <Link href="/liff/profiles">
            <ChevronLeft />
            名刺一覧へ
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-4 w-full max-w-md border rounded-lg shadow-lg">
        <div className="font-bold">
          新しい名刺を登録する
        </div>

        <ProfileCreateForm />
      </div>
    </div>
  );
}
