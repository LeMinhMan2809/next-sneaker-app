import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  adapter: MongoDBAdapter (clientPromise),
 
})