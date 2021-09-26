// This is an example of how to read a JSON Web Token from an API route
import { getToken } from 'next-auth/jwt'

export default async (req, res) => {
  // https://github.com/nextauthjs/next-auth/discussions/1496#discussioncomment-468596
  const token = await getToken({ req, secret: process.env.SECRET, signingKey: process.env.SIGNING_KEY })
  res.send(JSON.stringify(token, null, 2))
}
