"use server";

import { prisma } from "@/prisma/prisma";
import { ApplicationStatus } from "@prisma/client";

const updateJobStatus = async (formData: FormData) => {
  try {
    const jobId = Number(formData.get("jobId"));
    const status = formData.get("status") as ApplicationStatus;

    if (!Object.values(ApplicationStatus).includes(status)) {
      return { success: false, error: "Server Error. Invalid status value" };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: status },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export default updateJobStatus;
