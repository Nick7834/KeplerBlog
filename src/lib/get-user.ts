import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "./get-user-session";

export async function getUserData() {
  const session = await getUserSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id
    }
  });

  return user;
}