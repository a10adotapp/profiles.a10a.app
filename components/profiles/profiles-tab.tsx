"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function ProfilesTab({
  current,
}: {
  current: "recent" | "user-profiles";
}) {
  const router = useRouter();

  const handleValueChange = useCallback((value: string) => {
    if (value === "recent") {
      router.push("/liff/profiles/recent");
    }

    if (value === "user-profiles") {
      router.push("/liff/profiles/user-profiles");
    }
  }, [router]);

  return (
    <Tabs value={current} onValueChange={handleValueChange}>
      <TabsList>
        <TabsTrigger value="recent">新着</TabsTrigger>
        <TabsTrigger value="user-profiles">名刺入れ</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
