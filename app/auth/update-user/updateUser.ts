import { prisma } from "@/prisma/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";

type UpdateUserError = {
  success: false;
  error: string;
};

type UpdateUserSuccess = {
  success: true;
  data: User;
};

const updateUser = async () => {
  const user = await currentUser();
  if (!user) throw new Error("AuthError: User not authenticated");

  const userId = user.id;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || null;
  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
    user.emailAddresses[0]?.emailAddress ||
    null;

  try {
    const user: User = await prisma.user.upsert({
      where: { userId },
      update: { name, email: primaryEmail },
      create: {
        userId,
        name,
        email: primaryEmail,
        website: null,
        jobRole: null,
        industry: null,
        notes: null,
      },
    });

    const response: UpdateUserSuccess = { success: true, data: user };
    return response;
  } catch (error) {
    const errorResponse: UpdateUserError = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
    return errorResponse;
  }
};

export default updateUser;
