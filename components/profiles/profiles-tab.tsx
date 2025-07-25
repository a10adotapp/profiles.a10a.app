"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function ProfilesTab({
  current,
}: {
  current: "user-profiles" | "my-profile";
}) {
  const router = useRouter();

  const handleValueChange = useCallback((value: string) => {
    if (value === "user-profiles") {
      router.push("/liff/profiles/user-profiles");
    }

    if (value === "my-profile") {
      router.push("/liff/profiles/my-profile");
    }
  }, [router]);

  return (
    <Tabs value={current} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value="user-profiles">名刺入れ</TabsTrigger>
        <TabsTrigger value="my-profile">自分の名刺</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
