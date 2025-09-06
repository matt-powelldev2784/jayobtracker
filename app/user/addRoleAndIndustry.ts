"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma/prisma";
import { User } from "@prisma/client";

export type AddRoleAndIndustryResponse = {
  success: boolean;
  error?: string;
  data?: User;
};

export type AddRoleAndIndustryAction = (
  prevState: AddRoleAndIndustryResponse | null,
  formData: FormData
) => Promise<AddRoleAndIndustryResponse>;

export const addRoleAndIndustry: AddRoleAndIndustryAction = async (_prev, formData) => {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "User not authenticated." };

    const jobRoleData = formData.get("jobRole");
    const industryData = formData.get("industry");

    const jobRole = typeof jobRoleData === "string" ? jobRoleData.trim() : "";
    const industry = typeof industryData === "string" ? industryData.trim() : "";

    const updated = await prisma.user.update({
      where: { userId },
      data: { jobRole, industry },
    });

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
