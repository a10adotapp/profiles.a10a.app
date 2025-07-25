"use client";

import { Table, TableBody } from "@/components/ui/table";
import { Profile } from "@/prisma/generated/client";
import { CompanyAddressRow } from "./_components/company-address-row";
import { CompanyNameRow } from "./_components/company-name-row";
import { DepartmentRow } from "./_components/department-row";
import { EmailRow } from "./_components/email-row";
import { JobTitleRow } from "./_components/job-title-row";
import { NameRow } from "./_components/name-row";
import { PhoneNumberRow } from "./_components/phone-number-row";
import { PhoneticNameRow } from "./_components/phonetic-name-row";

export function ProfileAnalyzeResultTable({
  profile,
}: {
  profile: Profile;
}) {
  return (
    <Table>
      <TableBody>
        <NameRow profile={profile} />
        <PhoneticNameRow profile={profile} />
        <PhoneNumberRow profile={profile} />
        <EmailRow profile={profile} />
        <CompanyNameRow profile={profile} />
        <CompanyAddressRow profile={profile} />
        <DepartmentRow profile={profile} />
        <JobTitleRow profile={profile} />
      </TableBody>
    </Table>
  );
}
