// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import jose from 'jose'

const secret = process.env.NEXTAUTH_SECRET
const signingKey = process.env.SIGNING_KEY

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // https://github.com/nextauthjs/next-auth/discussions/1496#discussioncomment-468596
  
  const token = await getToken({ req })

  console.log("JSON Web Token", token)

  res.send(JSON.stringify(token, null, 2))
}


// export default async (req, res) => {
//   // https://github.com/nextauthjs/next-auth/discussions/1496#discussioncomment-468596
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, signingKey: process.env.SIGNING_KEY })
//   console.log("JSON Web Token", token)

//   // const _signingKey = jose.JWK.asKey(JSON.parse(process.env.SIGNING_KEY));
//   // const decodedToken = jose.JWT.verify(token, _signingKey, { algorithm: 'HS512' });
  
//   // console.log(decodedToken);
//   res.send(JSON.stringify(token, null, 2))
// }