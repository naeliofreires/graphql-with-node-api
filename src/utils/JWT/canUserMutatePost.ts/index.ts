import { Context } from '../../..'

interface CanUserMutatePostParams {
  userId: number
  postId: number
  prisma: Context['prisma']
}

async function canUserMutatePost({ prisma, userId, postId }: CanUserMutatePostParams) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    return {
      post: null,
      userErrors: [
        {
          message: 'User not found'
        }
      ]
    }
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!post) {
    return {
      post: null,
      userErrors: [
        {
          message: 'Post not owned by user'
        }
      ]
    }
  }
}

export default canUserMutatePost
