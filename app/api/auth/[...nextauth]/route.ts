import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '@/lib/db';
import { User } from '@/lib/types';
import * as bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('--- Authorize Function Start ---');
        console.log('Received credentials:', { email: credentials?.email, password: credentials?.password ? '[HIDDEN]' : undefined });

        if (!credentials?.email || !credentials.password) {
          console.log('Missing email or password.');
          console.log('--- Authorize Function End (Failure) ---');
          return null;
        }

        const connection = await pool.getConnection();
        console.log('Database connection acquired.');
        try {
          const [rows] = await connection.execute<User[]>(
            'SELECT * FROM Users WHERE email = ?',
            [credentials.email]
          );

          if (rows.length > 0) {
            const user = rows[0];
            console.log('User found in DB:', { id: user.id, email: user.email, password_hash: user.password });
            
            console.log('Comparing passwords...');
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );
            console.log('Password match result:', passwordMatch);

            if (passwordMatch) {
              console.log('Login successful for user:', user.email);
              console.log('--- Authorize Function End (Success) ---');
              return { id: user.id, name: user.name, email: user.email, role: user.role };
            } else {
              console.log('Password mismatch.');
            }
          } else {
            console.log(`No user found with email: ${credentials.email}`);
          }
          
          console.log('--- Authorize Function End (Failure) ---');
          return null;
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        } finally {
          connection.release();
          console.log('Database connection released.');
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
