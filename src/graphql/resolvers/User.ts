import { Context } from '../..'

interface UserParentType {
  id: number
}

export const User = {
  posts: async (parent: UserParentType, __: any, { user, prisma }: Context) => {
    const isOwnProfile = parent.id === user?.userId

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id
        },
        orderBy: [
          {
            createdAt: 'desc'
          }
        ]
      })
    } else {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true
        },
        orderBy: [
          {
            createdAt: 'desc'
          }
        ]
      })
    }
  }
}
