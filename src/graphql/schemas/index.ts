import { gql } from 'apollo-server'

export const schemas = gql`
  # # # # # Root
  type Query {
    me: User
    posts: [Post!]!
    profile (userId: ID!): Profile
  }

  type Mutation {
    postCreate (post: PostInput!): PostPayload!
    postUpdate (postId: ID!, post: PostInput!): PostPayload!
    postDelete (postId: ID!): PostPayload!
    postPublish (postId: ID!): PostPayload!
    postUnpublish (postId: ID!): PostPayload!
    signup (user: UserInput!): AuthPayload!
    signin (data: SignInInput!): AuthPayload!
  }

  # # # # # Types
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String! 
    email: String!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    post: Post
    userErrors: [UserError!]!
  }

  type AuthPayload {
    token: String
    userErrors: [UserError!]!
  }

  # # # # # Input 
  input PostInput {
    title: String
    content: String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    bio: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }
`
