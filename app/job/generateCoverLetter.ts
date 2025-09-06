"use server";

import { OpenAI } from "openai";
import { prisma } from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { GptModel } from "@/ts/gptModel";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateCoverLetterProps = {
  jobId: number;
  gptModel: GptModel;
};

export const generateCoverLetter = async ({ jobId, gptModel }: GenerateCoverLetterProps) => {
  try {
    // check user is authenticated
    const { userId } = await auth();
    if (!userId) throw new Error("AuthError: User not authenticated");

    // get job from db
    const job = await prisma.job.findUnique({
      where: { id: jobId, userId },
    });
    if (!job) throw new Error("PrismaError: Job not found");

    // create prompt
    const prompt = getPrompt({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      applicantWebsite: null,
    });

    // use open ai to generate cover letter
    const completion = await openai.chat.completions.create({
      model: gptModel,
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: gptModel === "gpt-5" ? 4000 : 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("OpenAIError: No content returned");

    // delete any existing cover letters
    await prisma.coverLetter.deleteMany({
      where: { jobId: job.id },
    });

    // save cover letter to database
    const coverLetter = await prisma.coverLetter.create({
      data: {
        jobId: job.id,
        content,
      },
    });

    return { success: true, data: coverLetter };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

type GetPromptProps = {
  title: string;
  company: string;
  description: string;
  location?: string | null;
  applicantWebsite: string | null;
};

const getPrompt = ({ title, company, location, description, applicantWebsite }: GetPromptProps) => {
  const prompt = `
  Write a concise cover letter (strictly 5 small paragraphs) for a junior developer role based on the provided job description. Follow this layout:
  Keep each paragraph short, clear, and professional. Do not add extra details outside of this structure.
  Use the 2 example cover letters to copy my style of writing, tone and structure.
  These cover letters also contain details about me that you could incorporate into the cover letter.
  these cover letters should be treated as the gold standard for tone, style and structure.

  --- Layout Guide (strictly 5 small paragraphs) ---
  Paragraph 1 = Im writing to express my interest in the ##JOB TITLE## position at ##COMPANY##. No other information.
  Paragraph 2 = 1 small sentence on why this company stood out or something specific about the role that appeals to you. 1 small sentence showing how you could contribute to company, product, or team based on what you know about them.
  Paragraph 3 = 1 or 2 sentences on how your skills, projects, or experiences make you a strong investment as a junior developer.
  Paragraph 4 = 1 sentence of how your previous experience has prepared you for this role, even if not directly related to software development.
  Paragraph 5 = A closing paragraph thanking them for their time, reinforcing your desire to join, and explaining why you would be an asset to the company.

  Job details:
  Title: ${title}
  Company: ${company}
  Location: ${location || "N/A"}
  Description: ${description}
  Applicant details:    Website: ${applicantWebsite || "N/A"}
  Example Cover Letter: ${coverLetterExample}
  Example Cover Letter 2: ${coverLetterExample2}
`;

  return prompt;
};

const coverLetterExample = `
I am excited to apply for the Junior/Mid Full-Stack Software Engineer role at Track Titan after hearing about the opportunity from our mutual friend Dan Page.

Track Titan does a great job of collecting and visualising data, which leads to real improvements for users’ track times. I am keen to contribute to improving this data visualisation to enable users to shave even more seconds off their laps.

I have a strong foundation in building and testing data-driven applications using TypeScript, NextJS, and NodeJS. I would love the opportunity to deepen my technical skills and expand my knowledge across the full tech stack.

In my current role as a project manager at a healthcare company supported by VC funding, I’m accustomed to adapting in a fast-paced, high-growth environment. I’m eager to bring the same hard work and dedication to contribute to Track Titan’s growth.

Thank you for considering my application. I would welcome the opportunity to discuss how I can contribute to delivering an outstanding platform for users.
`;

const coverLetterExample2 = `
Im writing to express my interest in the Junior Developer (Entry-Level) position at Apex Infinity Solutions. This position presents a fantastic opportunity for someone like me to grow my knowledge in a discipline I truly enjoy.

The combination of working in the in-demand Salesforce space and learning through Apex Infinity’s structured mentorship program is what really excites me about this role.

I have a strong foundation in building and testing data-driven applications using TypeScript, React, NextJS, and NodeJS. These projects demonstrate both my technical skills and my commitment to continuous learning. Please feel free to explore my portfolio and GitHub profile for a closer look at these projects.

With previous experience as a project manager in a fast-paced, high-growth environment, I have developed strong communication and problem-solving skills that will help me succeed in this role.

Thank you for considering my application. I would welcome the opportunity to discuss how I can help deliver effective Salesforce solutions and drive your business forward.`;
