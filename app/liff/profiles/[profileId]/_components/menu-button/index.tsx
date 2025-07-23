import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/prisma/generated/client";
import { EllipsisVertical } from "lucide-react";
import { MyProfileToggleItem } from "./_components/my-profile-toggle-item";
import { UserProfileToggleItem } from "./_components/user-profile-toggle-item";

export function MenuButton({
  profileId,
  userProfile,
}: {
  profileId: string;
  userProfile: UserProfile | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        )}>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <UserProfileToggleItem
          profileId={profileId}
          userProfile={userProfile} />
        <MyProfileToggleItem
          profileId={profileId}
          userProfile={userProfile} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
