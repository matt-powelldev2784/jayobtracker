'use server'

import { prisma } from '@/prisma/prisma'

export const addJob = async (prevState: unknown, formData: FormData) => {
  try {
    const title = formData.get('title') as string
    const company = formData.get('company') as string
    const location = formData.get('location') as string
    const url = formData.get('url') as string
    const description = formData.get('description') as string

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        url,
        description,
      },
    })

    return { success: true, job }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
