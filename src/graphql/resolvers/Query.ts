import { Context } from '../..'

export const Query = {
  me: async (_: any, __: any, { prisma, user }: Context) => {
    if (!user) return null

    return await prisma.user.findUnique({
      where: {
        id: user.userId
      }
    })
  },

  posts: async (_: any, __: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    })

    return posts
  },

  profile: async (_: any, __: any, { prisma, user }: Context) => {
    return await prisma.profile.findUnique({
      where: {
        userId: Number(user?.userId)
      }
    })
  }
}
