import { Context } from '../..'
import { userLoader } from '../loaders/userLoader'

interface PostParentType {
  authorId: number
}

/**
 * Using DataLoader
 */
export const Post = {
  user: async (parent: PostParentType, __: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId)
  }
}

/**
 * Not Using DataLoader
 */
// export const Post = {
//   user: async (parent: PostParentType, __: any, { prisma }: Context) => {
//     return await prisma.user.findUnique({
//       where: {
//         id: parent.authorId
//       }
//     })
//   }
