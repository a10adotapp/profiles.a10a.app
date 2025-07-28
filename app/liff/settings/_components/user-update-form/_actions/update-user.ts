"use server";

import { auth } from "@/lib/auth";
import { serverError } from "@/lib/log/server";
import prisma from "@/prisma";

export async function updateUser(id: string, data: {
  companyName: string | null,
  companyAddressPrefecture: string | null,
  companyAddressRest: string | null,
  industrialDivision: string | null,
  industrialMajorGroup: string | null,
  industrialGroup: string | null,
  department: string | null,
  jobTitle: string | null,
  name: string | null,
  phoneticName: string | null,
  phoneNumber: string | null,
  email: string | null,
}): Promise<void> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("unauthenticated");
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        companyName: data.companyName,
        companyAddressPrefecture: data.companyAddressPrefecture,
        companyAddressRest: data.companyAddressRest,
        industrialDivision: data.industrialDivision,
        industrialMajorGroup: data.industrialMajorGroup,
        industrialGroup: data.industrialGroup,
        department: data.department,
        jobTitle: data.jobTitle,
        name: data.name,
        phoneticName: data.phoneticName,
        phoneNumber: data.phoneNumber,
        email: data.email,
      },
    });
  } catch (err) {
    serverError({
      action: "updateUser",
      data: {
        ...data,
        error: err,
        id,
      },
    });

    throw err;
  }
}
