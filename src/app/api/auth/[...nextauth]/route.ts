import { env } from '@/env'
import { randomUUID } from 'crypto'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const credentialsProvider = CredentialsProvider({
  credentials: {
    email: {
      label: 'E-mail',
      type: 'email',
      placeholder: 'use admin@washhub.team',
      value: 'admin@washhub.team',
    },
    password: {
      label: 'Password',
      type: 'password',
      value: 'admin',
      placeholder: 'use 123456',
    },
  },
  async authorize(credentials) {
    if (
      credentials?.email === 'admin@washub.team' &&
      credentials.password === '123456'
    ) {
      return {
        id: randomUUID(),
        email: credentials.email,
        name: 'Admin',
        image: 'https://github.com/gjubal.png',
      }
    }

    throw new Error('Unauthorized.')
  },
})

const handler = NextAuth({
  providers: [
    env.VERCEL_ENV === 'preview'
      ? credentialsProvider
      : GoogleProvider({
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          authorization: {
            params: {
              prompt: 'consent',
              access_type: 'offline',
              response_type: 'code',
            },
          },
        }),
  ],
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
})

export { handler as GET, handler as POST }
