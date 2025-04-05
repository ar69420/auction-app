import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; 
import clientPromise from "../../../../lib/database/mongodb";
import User from "../../../../models/schema/user"; 
import dbConnect from "../../../../models/page"; 

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: "Email",
        credentials: {
          email: { label: "Email", type: "email", required: true },
          password: { label: "Password", type: "password", required: true },
        },
        async authorize(credentials) {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
  
          if (!user) throw new Error("User not found");
  
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) throw new Error("Invalid credentials");
  
          if (!user.isVerified) throw new Error("Verify your email first");
  
          return { id: user._id, email: user.email, name: user.name };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.id = token.id;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });