import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/prisma/prisma'
import type { ApplicationStatus } from '@prisma/client'

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

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { coverLetter: true },
    })

    const total = await prisma.job.count({ where: whereClause })

    return {
      success: true,
      data: {
        jobs,
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
