import PostResolvers from './post'
import AuthResolvers from './auth'

export const Mutation = {
  ...PostResolvers,
  ...AuthResolvers
}
