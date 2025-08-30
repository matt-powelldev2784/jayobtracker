import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/prisma'
import type { ApplicationStatus } from '@prisma/client'
import type { Job } from '@prisma/client'

export type GetJobsSuccess = {
  success: true
  data: {
    jobs: Job[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export type GetJobsError = {
  success: false
  error: string
}

export const getJobs = async ({
  status,
  page = 1,
}: {
  status?: ApplicationStatus
  page?: number
}) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Not authenticated')

    const PAGE_SIZE = 10
    const whereClause = status ? { userId, status } : { userId }

    const jobs: Job[] = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { coverLetter: true },
    })

    const total = await prisma.job.count({ where: whereClause })

    const data = {
      jobs,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    }

    const response: GetJobsSuccess = {
      success: true,
      data,
    }

    return response
  } catch (error) {
    const errorResponse: GetJobsError = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
    return errorResponse
  }
}
