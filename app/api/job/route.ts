import { prisma } from '@/prisma/prisma'

export const POST = async (request: Request) => {
  try {
    const data = await request.json()
    const { title, company, location, url, description } = data

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        url,
        description,
      },
    })

    return Response.json({ success: true, job })
  } catch (error: unknown) {
    const err = error as Error
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

export const GET = async () => {
  try {
    const jobs = await prisma.job.findMany()

    return Response.json({ success: true, jobs })
  } catch (error: unknown) {
    const err = error as Error
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
