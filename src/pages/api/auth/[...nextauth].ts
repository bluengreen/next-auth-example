import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

import jose from 'jose'
// import prisma from '@/lib/prisma'

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  adapter: PrismaAdapter(prisma),
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains
      
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
  ],
  session: {
    strategy: "jwt",
  },

  jwt: {
    // maxAge: 24 * 60 * 60,
    // secret: process.env.NEXTAUTH_SECRET,
    // signingKey: process.env.SIGNING_KEY,

    // add claims hasura gql needs in the jwt
    //   // const jwtClaims = {
    //   //   "sub": token.id,
    //   //   "name": token.name ,
    //   //   "email": token.email,
    //   //   "iat": Date.now() / 1000,
    //   //   "exp": Math.floor(Date.now() / 1000) + (24*60*60),
      //   //   "https://hasura.io/jwt/claims": {
      //   //     "x-hasura-allowed-roles": ["user"],
      //   //     "x-hasura-default-role": "user",
      //   //     "x-hasura-role": "user",
      //   //     "raw": token,
      //   //     "x-hasura-user-id": token.id
      //   //   }
    //   // };

    // async encode({ token, secret, signingKey }) {
    //   const _signingKey = jose.JWK.asKey(JSON.parse(signingKey));
    //   const signedToken = jose.JWT.sign(token, _signingKey, { algorithm: 'HS512' });
    //   return signedToken;
    // },

    // async decode({ token, secret, signingKey }) {
    //   // console.log(token)
    //   // const tk = "eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiUGhpbGxpcCBOb3Zlc3MiLCJlbWFpbCI6InBoaWxsaXBAbm92ZXNzLmNvbSIsInBpY3R1cmUiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvOTAxMTQ_dj00Iiwic3ViIjoiY2t6cDgwMXdlMDA3NHAweHEzN3N3aGY1aSIsImlkIjoiY2t6cDgwMXdlMDA3NHAweHEzN3N3aGY1aSIsInVzZXIiOnsiaWQiOiJja3pwODAxd2UwMDc0cDB4cTM3c3doZjVpIiwibmFtZSI6IlBoaWxsaXAgTm92ZXNzIiwiZW1haWwiOiJwaGlsbGlwQG5vdmVzcy5jb20iLCJlbWFpbFZlcmlmaWVkIjpudWxsLCJpbWFnZSI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS85MDExND92PTQifSwiaWF0IjoxNjQ0OTk3Njc1fQ.bMiyF-FZiGtBOhwtMMMCwxThkEwOwkO5nSFpJPrP0Vj5rmdvAtmj22ofMXcO4U60bvlQlr8vwb8_D3K5TiyR9w";
    //   const _signingKey = jose.JWK.asKey(JSON.parse(signingKey));
    //   const decodedToken = jose.JWT.verify(token, _signingKey, { algorithm: 'HS512' });
    //   console.log( "DECODE", decodedToken);
    //   return decodedToken;
    // },
  },
  theme: {
    colorScheme: "light",
  },
  debug: false,  
  // pages: {
  //   signIn: '/auth/signin',
  // },
  callbacks: {
    // async jwt({ token }) {
    //   token.userRole = "admin"
    //   return token
    // },

    // modify to return userid for hasura gql
    async session({session, token, user}) {
      const _signingKey = jose.JWK.asKey(JSON.parse(process.env.SIGNING_KEY));
      const signedToken = jose.JWT.sign(token, _signingKey, { algorithm: 'HS512' });
      session.accessToken = signedToken;
      return session;
    },

    async jwt({token, user, account, profile, isNewUser}) {
      const isUserSignedIn = user ? true : false;
      // make a http call to our graphql api
      // store this in postgres
      // console.log(token)
      if(isUserSignedIn) {
        token.id = user.id.toString();
        token.user = user;
        token.userRole = "admin"

        token.hasura = {
          claims: {
            "x-hasura-allowed-roles": ["user"],
            "x-hasura-default-role": "user",
            "x-hasura-role": "user",
            "x-hasura-user-id": token.id
          }
        } 
      } 

      return token
    }
    
  },
})
