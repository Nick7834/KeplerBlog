import { prisma } from '@/prisma/prisma-client';

export async function checkAndVerifyActiveUsers() {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const usersWithCheckmark = await prisma.user.findMany({
    where: {
      isverified: true, 
      role: { in: ['admin', 'user'] },
    },
    include: {
      posts: true,
      followers: true,
      likes: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          likes: true,
        },
      },
    },
  });

  for (const user of usersWithCheckmark) {
    const hasEnoughPosts = user._count.posts >= 10;
    const hasEnoughFollowers = user._count.followers >= 10;
    const hasEnoughLikes = user._count.likes >= 200;
    const isOldEnough = new Date().getTime() - new Date(user.createdAt).getTime() >= 30 * 24 * 60 * 60 * 1000;
    const shouldHaveCheckmark = user.role === 'admin' || (hasEnoughPosts && hasEnoughFollowers && hasEnoughLikes && isOldEnough && user.isverified);

    if (shouldHaveCheckmark !== !!user.isverified) {
      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: user.id },
          data: { isverified: shouldHaveCheckmark },
        });
      });
    }
  }

  const activeUsers = await prisma.user.findMany({
    where: {
      role: { in: ['admin', 'user'] },
      OR: [
        { posts: { some: { createdAt: { gte: oneMonthAgo } } } },
        { likes: { some: { createdAt: { gte: oneMonthAgo } } } },
        { followers: { some: { createdAt: { gte: oneMonthAgo } } } },
      ],
    },
    include: {
      _count: {
        select: {
          followers: true,
          posts: true,
        },
      },
      posts: {
        select: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      },

    },
  });

  for (const user of activeUsers) {
    const hasEnoughPosts = user._count.posts >= 10;
    const hasEnoughFollowers = user._count.followers >= 10;
    const hasEnoughLikes =  user?.posts.reduce((total, post) => total + post._count.likes, 0) >= 200;
    const isOldEnough = new Date().getTime() - new Date(user.createdAt).getTime() >= 30 * 24 * 60 * 60 * 1000;
    const shouldHaveCheckmark = user.role === 'admin' || hasEnoughFollowers && hasEnoughPosts && hasEnoughLikes && isOldEnough && user.isverifiedEmail;

    if (shouldHaveCheckmark !== !!user.isverified) {
      await prisma.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { id: user.id },
          data: { isverified: shouldHaveCheckmark },
        });
      });
    }
  }
}
