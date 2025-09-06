"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma/prisma";
import { ExampleCoverLetter } from "@prisma/client";

export type AddExampleCoverLetterResponse = {
  success: boolean;
  error?: string;
  data?: ExampleCoverLetter;
};

export type AddExampleCoverLetterAction = (
  prevState: AddExampleCoverLetterResponse | null,
  formData: FormData
) => Promise<AddExampleCoverLetterResponse>;

export const addExampleCoverLetter: AddExampleCoverLetterAction = async (_prevState, formData) => {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "User not authenticated." };

    const coverLetter = formData.get("coverLetter");
    if (!coverLetter || typeof coverLetter !== "string") {
      return { success: false, error: "Error reading cover letter data." };
    }

    if (coverLetter.length < 100) {
      return { success: false, error: "Minimum 100 characters required." };
    }

    const newCoverLetter = await prisma.exampleCoverLetter.create({
      data: { content: coverLetter, userId },
    });

    return { success: true, data: newCoverLetter };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
