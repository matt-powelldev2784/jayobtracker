"use server";

import { OpenAI } from "openai";
import { prisma } from "@/prisma/prisma";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateCoverLetter = async (jobId: number) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Fetch job details from DB
    const job = await prisma.job.findUnique({
      where: { id: jobId, userId },
    });
    if (!job) throw new Error("Job not found");

    // Build the prompt
    const prompt = getPrompt({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      portfolio: "https://matthew-powell-dev.com/",
    });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    // Save to DB
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
  portfolio?: string | null;
};

const getPrompt = ({ title, company, location, description, portfolio }: GetPromptProps) => {
  const prompt = `
    You are an expert job application assistant. 
    Write a professional and formal cover letter for the following junior software developer job. 
    Your goal is to make the letter concise, specific, and tailored to the company. 
    Do not include markdown, code formatting, or commentary — return only the plain text cover letter.

    Job details:
    Title: ${title}
    Company: ${company}
    Location: ${location || "N/A"}
    Description: ${description}
    Portfolio: ${portfolio || "N/A"}

  --- Example Cover Letter ---
  ${coverLetterExample}

  --- Layout Guide (strictly 4 paragraphs) ---
  1. 1 or 2 sentences on why this company stood out, extrapolating a plausible reason if not stated directly in the job ad. 
  2. 1 sentence showing how your motivation, energy, and willingness to learn make you a strong investment as a junior developer. 
  3. 1 or 2 sentences on how your skills, projects, or experiences (including portfolio if provided) prepare you to succeed at the tasks they need done. 
  4. A closing paragraph thanking them for their time, reinforcing your desire to join, and explaining why you would be an asset to the company.

  --- Additional Instructions ---
  - Absolutely avoid generic stock phrases such as:
  "I am excited to apply," 
  "I believe I am the perfect fit," 
  "I am writing to express my interest," 
  "With great enthusiasm," 
  or similar clichés. 
  - Keep sentences crisp and free of filler. 
  - Minimize adjectives/adverbs; prefer concrete statements over vague enthusiasm. 
  - Where possible, ground statements in facts (skills, portfolio, relevant tools) rather than vague claims. 
  - Vary sentence openings to avoid repetitive patterns. 
  - Mix sentence lengths: include some short, direct sentences and some longer, more developed ones for a natural human rhythm. 
  - Ensure the tone is professional, respectful, and confident without exaggeration. 
  - Always use exactly four paragraphs with line breaks between them.
  - The final output should read as naturally human-written, not formulaic or over-polished.`;

  return prompt;
};

const coverLetterExample = `Dear Hiring Team,

I am writing to express my interest in the Junior/Mid Full-Stack Software Engineer role at Track Titan. 

With a strong foundation in building and testing full-stack applications using NextJS, NodeJS, and Postgres, I’m eager to work across the tech stack on an innovative project building the “Strava for Motorsport”.

In my current role as a project manager at a healthcare company supported by VC funding, I’m accustomed to adapting in a fast-paced, high-growth environment.

While I’m not an expert in sim racing, I understand its importance as both a competitive esport and a powerful training tool, providing data that helps drivers enhance their skills.

Thank you for considering my application. I would love the opportunity to deepen my technical skills and help take your platform to the next level.

Regards

Matthew Powell`;
