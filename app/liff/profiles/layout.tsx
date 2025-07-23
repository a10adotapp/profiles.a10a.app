import { Button } from "@/components/ui/button";
import { LayoutProps } from "@/lib/layout-props";
import Link from "next/link";

export default async function Layout(props: LayoutProps) {
  return (
    <div className="relative flex flex-col gap-4">
      {props.children}

      <div
        className="sticky z-10 mx-2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 2em)",
        }}>
        <Button
          asChild
          className="shadow-lg">
          <Link href="/liff/profiles/new">
            新しい名刺を登録する
          </Link>
        </Button>
      </div>
    </div>
  );
}
