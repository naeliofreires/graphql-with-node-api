import { Post } from '@prisma/client'
import { Context } from '../../..'
import canUserMutatePost from '../../../utils/JWT/canUserMutatePost.ts'

interface PostArgs {
  title?: string
  content?: string
}

interface PostPayloadType {
  userErrors: {
    message: string
  }[]
  post: Post | null
}

export default {
  postCreate: async (_: any, args: { post: PostArgs }, { prisma, user }: Context): Promise<PostPayloadType> => {
    const title = args.post.title
    const content = args.post.content

    if (!user) {
      return {
        post: null,
        userErrors: [
          {
            message: 'invalid token'
          }
        ]
      }
    }

    if (!title || !content) {
      return {
        post: null,
        userErrors: [
          {
            message: 'You must provide title and content to create a post'
          }
        ]
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.userId
      }
    })

    return {
      userErrors: [],
      post
    }
  },

  postUpdate: async (_: any, args: { postId: string; post: PostArgs }, context: Context): Promise<PostPayloadType> => {
    const { prisma, user } = context
    const { title, content } = args.post

    if (!user) {
      return {
        post: null,
        userErrors: [
          {
            message: 'invalid token'
          }
        ]
      }
    }

    const errors = await canUserMutatePost({
      prisma,
      userId: user.userId,
      postId: Number(args.postId)
    })

    if (errors) return errors

    if (!title && !content) {
      return {
        post: null,
        userErrors: [
          {
            message: 'Need to have at least one field to be updated'
          }
        ]
      }
    }

    const where = { id: Number(args.postId) }
    const existing = await prisma.post.findUnique({ where })

    if (!existing) {
      return {
        post: null,
        userErrors: [
          {
            message: 'Post does not exist'
          }
        ]
      }
    }

    const data = { title, content }
    if (!title) delete data.title
    if (!content) delete data.content

    return {
      userErrors: [],
      post: await prisma.post.update({ where, data: { ...data } })
    }
  },

  postDelete: async (_: any, args: { postId: string }, { prisma, user }: Context): Promise<PostPayloadType> => {
    if (!user) {
      return {
        post: null,
        userErrors: [
          {
            message: 'invalid token'
          }
        ]
      }
    }

    const errors = await canUserMutatePost({
      prisma,
      userId: user.userId,
      postId: Number(args.postId)
    })

    if (errors) return errors

    const post = await prisma.post.findUnique({
      where: {
        id: Number(args.postId)
      }
    })

    if (!post) {
      return {
        post: null,
        userErrors: [
          {
            message: 'Post does not exist'
          }
        ]
      }
    }

    await prisma.post.delete({ where: { id: Number(args.postId) } })

    return {
      userErrors: [],
      post
    }
  },

  postPublish: async (_: any, { postId }: { postId: string }, { user, prisma }: Context): Promise<PostPayloadType> => {
    if (!user) {
      return {
        post: null,
        userErrors: [
          {
            message: 'invalid token'
          }
        ]
      }
    }

    const errors = await canUserMutatePost({
      prisma,
      userId: user.userId,
      postId: Number(postId)
    })

    if (errors) return errors

    return {
      post: await prisma.post.update({
        where: {
          id: Number(postId)
        },
        data: {
          published: true
        }
      }),
      userErrors: []
    }
  },

  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { user, prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!user) {
      return {
        post: null,
        userErrors: [
          {
            message: 'invalid token'
          }
        ]
      }
    }

    const errors = await canUserMutatePost({
      prisma,
      userId: user.userId,
      postId: Number(postId)
    })

    if (errors) return errors

    return {
      post: await prisma.post.update({
        where: {
          id: Number(postId)
        },
        data: {
          published: false
        }
      }),
      userErrors: []
    }
  }
}
