"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function LiffTopTab({
  current,
}: {
  current: "profiles" | "profiles-owned" | "settings";
}) {
  const router = useRouter();

  const handleValueChange = useCallback((value: string) => {
    if (value === "profiles") {
      router.push("/liff/profiles");
    }

    if (value === "profiles-owned") {
      router.push("/liff/profiles/owned");
    }

    if (value === "settings") {
      router.push("/liff/settings");
    }
  }, [router]);

  return (
    <Tabs value={current} onValueChange={handleValueChange}>
      <TabsList className="w-full">
        <TabsTrigger value="profiles">名刺入れ</TabsTrigger>
        <TabsTrigger value="profiles-owned">自分の名刺</TabsTrigger>
        <TabsTrigger value="" className="flex-1"></TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
