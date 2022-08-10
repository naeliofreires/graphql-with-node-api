import JWT from 'jsonwebtoken'

async function getUser(token: string) {
  try {
    const verified = await JWT.verify(token, 'developer')
    return verified as { userId: number }
  } catch (error) {
    return null
  }
}

export default getUser
