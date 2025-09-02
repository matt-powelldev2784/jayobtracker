"use server";

import { OpenAI } from "openai";
import { prisma } from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCoverLetter = async (jobId: number) => {
  try {
    // check user is authenticated
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // get job from db
    const job = await prisma.job.findUnique({
      where: { id: jobId, userId },
    });
    if (!job) throw new Error("Job not found");

    // create prompt
    const prompt = getPrompt({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      applicantWebsite: "https://matthew-powell-dev.com/",
    });

    // use open ai to generate cover letter
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

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
    You are an expert job application assistant. 
    Write a professional and formal cover letter for the following junior software developer job. 
    Your goal is to make the letter concise, specific, and tailored to the company.
    Write a cover letter that is exactly 5 paragraphs long.
    Do not include markdown, code formatting, or commentary — return only the plain text cover letter.

  --- Layout Guide (strictly 5 small paragraphs) ---
  Paragraph 1 =  I’m writing to express my interest in the ##JOB TITLE##  position at ##COMPANY##. No other information.
  Paragraph 2 =  1 small sentence on why this company stood out or something specific about the role that appeals to you. 
                 1 small sentence showing how you could contribute to company, product, or team based on what you know about them. 
  Paragraph 3 = 1 or 2 sentences on how your skills, projects, or experiences and/or what makes you a strong investment as a junior developer.
  Paragraph 4 = 1 sentence of how your previous experience has prepared you for this role, even if not directly related to software development.
  Paragraph 5 = 1A closing paragraph thanking them for their time, reinforcing your desire to join, and explaining why you would be an asset to the company.


    Job details:
    Title: ${title}
    Company: ${company}
    Location: ${location || "N/A"}
    Description: ${description}
    ApplicantWebsite: ${applicantWebsite}

  --- Example Cover Letter ---
  ${coverLetterExample}

   --- Additional Instructions ---
  - Absolutely avoid generic stock phrases such as:
    "I am excited to apply," 
    "I believe I am the perfect fit," 
    "I am writing to express my interest," 
    "With great enthusiasm," 
    or similar clichés. 
  - Do not use intensifiers or filler modifiers such as: truly, very, highly, deeply, extremely, absolutely, really, strongly, greatly, incredibly, or similar words. 
  - If you feel the urge to write something like "truly innovative," "highly motivating," or similar, replace it with a plain factual description (e.g., "a new approach," "an appealing opportunity," "a significant development"). 
  - Keep sentences crisp and free of filler. 
  - Minimize adjectives; only use them when they add concrete meaning (e.g., “open-source tools” is fine, but “remarkably innovative tools” is not). 
  - Express enthusiasm through specific details (skills, portfolio projects, company facts) rather than subjective emphasis. 
  - Where possible, ground statements in facts (skills, portfolio, relevant tools) rather than vague claims. 
  - Vary sentence openings to avoid repetitive patterns. 
  - Mix sentence lengths: include some short, direct sentences and some longer, more developed ones for a natural human rhythm. 
  - Ensure the tone is professional, respectful, and confident without exaggeration. 
  - Always use exactly four paragraphs with line breaks between them.
  - The final output should read as naturally human-written, not formulaic or over-polished.
  - Do not include any sign-off (e.g., "Sincerely," "Best regards,").
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
