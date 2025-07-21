import { prisma } from "@/prisma/prisma-client";

export async function checkAndVerifyActiveUsers() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const activeUsers = await prisma.user.findMany({
    where: {
      OR: [
        // 1. Активные юзеры с подходящей ролью
        {
          role: { in: ["admin", "user"] },
          OR: [
            { posts: { some: { createdAt: { gte: oneMonthAgo } } } },
            { likes: { some: { createdAt: { gte: oneMonthAgo } } } },
            { followers: { some: { createdAt: { gte: oneMonthAgo } } } },
            { comments: { some: { createdAt: { gte: oneMonthAgo } } } },
          ],
        },
        // 2. Все с галочкой, независимо от активности и роли
        {
          isverified: true,
        },
      ],
    },
    select: {
      id: true,
      role: true,
      isverified: true,
      isverifiedEmail: true,
      createdAt: true,
      _count: {
        select: {
          following: true,
          posts: true,
        },
      },
      posts: {
        select: {
          _count: {
            select: { likes: true },
          },
        },
      },
    },
  });

  const userUpdates = activeUsers
    .map((user) => {
      const hasEnoughPosts = user._count.posts >= 10;
      const hasEnoughFollowers = user._count.following >= 12;
      const totalLikes = user.posts.reduce(
        (sum, post) => sum + post._count.likes,
        0
      );
      const hasEnoughLikes = totalLikes >= 250;
      const isOldEnough =
        new Date().getTime() - new Date(user.createdAt).getTime() >=
        30 * 24 * 60 * 60 * 1000;
      const shouldHaveCheckmark =
        user.role === "admin" ||
        (hasEnoughFollowers &&
          hasEnoughPosts &&
          hasEnoughLikes &&
          isOldEnough &&
          user.isverifiedEmail);

      return shouldHaveCheckmark !== !!user.isverified
        ? { where: { id: user.id }, data: { isverified: shouldHaveCheckmark } }
        : null;
    })
    .filter(Boolean);

  if (userUpdates.length > 0) {
    await prisma.$transaction(
      userUpdates.map((update) => prisma.user.update(update!))
    );
  }
}
