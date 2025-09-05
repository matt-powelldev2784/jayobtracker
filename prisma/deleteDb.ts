import { prisma } from "./prisma";

const deleteDb = async () => {
  await prisma.coverLetter.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.user.deleteMany({});
};

export default deleteDb;
