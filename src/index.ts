import { ApolloServer } from 'apollo-server'
import { schemas } from './graphql/schemas'
import { Query } from './graphql/resolvers/Query'
import { Mutation } from './graphql/resolvers/mutation'
import { PrismaClient, Prisma } from '@prisma/client'
import getUser from './utils/JWT/getUser'
import { Profile } from './graphql/resolvers/Profile'
import { Post } from './graphql/resolvers/Post'
import { User } from './graphql/resolvers/User'

export const prisma = new PrismaClient()

export interface Context {
  user: { userId: number } | null
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
}

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User
  },
  context: async ({ req }): Promise<Context> => {
    const user = await getUser(req.headers?.authorization || '')

    return {
      user,
      prisma
    }
  }
})

server.listen().then(({ url }) => console.log('Server ready on', url))
