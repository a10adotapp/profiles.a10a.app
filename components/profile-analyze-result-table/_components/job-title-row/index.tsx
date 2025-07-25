"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Profile } from "@/prisma/generated/client";
import { useCallback, useState } from "react";
import { ProfileUpdateForm } from "./_components/profile-update-form";

export function JobTitleRow({
  profile,
}: {
  profile: Profile;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleProfileUpdateFormUpdated = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <TableRow>
        <TableHead>役職など</TableHead>
        <DrawerTrigger asChild>
          <TableCell className="w-full">
            {profile.jobTitle}
          </TableCell>
        </DrawerTrigger>
      </TableRow>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-start">
            役職など
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4" style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 2em)",
        }}>
          <ProfileUpdateForm
            profile={profile}
            onUpdated={handleProfileUpdateFormUpdated} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
