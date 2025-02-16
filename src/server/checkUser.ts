import { prisma } from '@/prisma/prisma-client';

export async function checkAndVerifyActiveUsers() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const activeUsers = await prisma.user.findMany({
    where: {
      role: { in: ['admin', 'user'] },
      OR: [
        { isverified: true },
        { posts: { some: { createdAt: { gte: oneMonthAgo } } } },
        { likes: { some: { createdAt: { gte: oneMonthAgo } } } },
        { followers: { some: { createdAt: { gte: oneMonthAgo } } } },
        { comments: { some: { createdAt: { gte: oneMonthAgo } } } },
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
      const hasEnoughFollowers = user._count.following >= 10;
      const totalLikes = user.posts.reduce((sum, post) => sum + post._count.likes, 0);
      const hasEnoughLikes = totalLikes >= 200;
      const isOldEnough = new Date().getTime() - new Date(user.createdAt).getTime() >= 30 * 24 * 60 * 60 * 1000;
      const shouldHaveCheckmark =
        user.role === 'admin' || (hasEnoughFollowers && hasEnoughPosts && hasEnoughLikes && isOldEnough && user.isverifiedEmail);

      return shouldHaveCheckmark !== !!user.isverified
        ? { where: { id: user.id }, data: { isverified: shouldHaveCheckmark } }
        : null;
    })
    .filter(Boolean); 

  if (userUpdates.length > 0) {
    await prisma.$transaction(userUpdates.map((update) => prisma.user.update(update!)));
  }
}
