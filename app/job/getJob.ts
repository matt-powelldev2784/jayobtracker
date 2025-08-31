import { prisma } from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { Job, CoverLetter } from "@prisma/client";

type GetJobSuccess = {
  success: true;
  data: { job: Job; coverLetter: CoverLetter | null };
};

type GetJobError = {
  success: false;
  error: string;
};

export const getJob = async (id: number) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const job = await prisma.job.findUnique({
      where: { id, userId },
    });
    if (!job) throw new Error("Job not found");

    const coverLetter = await prisma.coverLetter.findUnique({
      where: { jobId: id },
    });

    const response: GetJobSuccess = { success: true, data: { job, coverLetter } };

    return response;
  } catch (error) {
    const errorResponse: GetJobError = { success: false, error: (error as Error).message };
    return errorResponse;
  }
};
