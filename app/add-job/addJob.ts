'use server'

import { OpenAI } from 'openai'
import { prisma } from '@/prisma/prisma'
import type { Job } from '@prisma/client'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const parseJobDetails = async (prevState: unknown, formData: FormData) => {
  const text = formData.get("text") as string;
  const url = formData.get("url") as string;

  const prompt = `
    Extract the following fields from the pasted job description:
    - title
    - company
    - location
    - url
    - description

    The description should include all details from the job description.

    Return the result as a JSON object.
    The returned object must be valid JSON and parsable by JSON.parse()

    I do not want a OpenAI response which sometimes includes Markdown formatting
    (like triple backticks and a json code block), so the result is not valid JSON for
    JSON.parse.

    I must have valid JSON returned.

    Job description:
    ${text}
    URL: ${url || ""}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.2,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI.");
    console.log("content", content);

    const data = JSON.parse(content);
    if (!data.title || !data.company || !data.description) {
      throw new Error(
        "Unable to extract data. Please ensure the job description is valid and contains the title and company."
      );
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: `Error. ${String(error)} Please try to submit again.`,
    };
  }
};

type JobInput = Omit<Job, "id" | "createdAt" | "updatedAt" | "coverLetter">;

const addJobToDb = async (jobData: JobInput) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "User not authenticated." };
    }

    const job = await prisma.job.create({
      data: { ...jobData, userId },
    });
    return { success: true, data: job };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const processJobSubmission = async (prevState: unknown, formData: FormData) => {
  // Parse job details
  const parseResult = await parseJobDetails(prevState, formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error };
  }

  // Add job to database
  const addJobToDbResult = await addJobToDb(parseResult.data);
  if (!addJobToDbResult.success) {
    return { success: false, error: addJobToDbResult.error };
  }

  // On success, redirect to home page
  redirect("/view-jobs");
};
