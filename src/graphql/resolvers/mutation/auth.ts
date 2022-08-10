import bcrypt from 'bcryptjs'
import validator from 'validator'
import JWT from 'jsonwebtoken'

import { Context } from '../../..'

interface SigninArgs {
  data: {
    email: string
    password: string
  }
}

interface SignupArgs {
  user: {
    name: string
    email: string
    password: string
    bio: string
  }
}

interface UserPayload {
  token: string | null
  userErrors: { message: string }[]
}

export default {
  signup: async (_: any, args: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
    const { name, email, password, bio } = args.user

    const isEmail = validator.isEmail(email)
    if (!isEmail) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid email'
          }
        ]
      }
    }

    const isValidPassword = validator.isLength(password, { min: 5 })
    if (!isValidPassword) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid password'
          }
        ]
      }
    }

    if (!name || !bio) {
      return {
        token: null,
        userErrors: [
          {
            message: 'Invalid name or bio'
          }
        ]
      }
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, password: hash } })

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id
      }
    })

    const token = await JWT.sign({ userId: user.id, email: user.email }, 'developer', { expiresIn: 3600000 })

    return {
      token,
      userErrors: []
    }
  },
  signin: async (_: any, args: SigninArgs, { prisma }: Context): Promise<UserPayload> => {
    const user = await prisma.user.findUnique({
      where: {
        email: args.data.email
      }
    })

    if (!user) {
      return {
        token: null,
        userErrors: [
          {
            message: 'invalid email or password'
          }
        ]
      }
    }

    const validation = await bcrypt.compare(args.data.password, user.password)

    if (!validation) {
      return {
        token: null,
        userErrors: [
          {
            message: 'invalid email or password'
          }
        ]
      }
    }

    const _token = await JWT.sign({ userId: user.id, email: user.email }, 'developer', { expiresIn: 3600000 })

    return {
      token: _token,
      userErrors: []
    }
  }
}
