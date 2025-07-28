import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Content from "./content.mdx";

export default async function Page() {
  return (
    <div className="p-4">

      <Tabs>
        <TabsList className="w-full">
          <TabsTrigger value="profiles">名刺入れ</TabsTrigger>
          <TabsTrigger value="profiles-owned">自分の名刺</TabsTrigger>
          <TabsTrigger value="" className="flex-1"></TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>
      </Tabs>

      <Content />
    </div>
  );
}
