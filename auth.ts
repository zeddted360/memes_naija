import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/utils/connectDB";
import { user } from "@/models/model";

export const BASE_PATH = "/api/auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        userId: {
          label: "username",
          type: "text",
          placeholder: "username or email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials, request) => {
        const { userId, password } = credentials;
        try {
          await connectDB();
          const existUser = await user.findOne({
            $or: [{ email: userId }, { username: userId }],
          });
          if (existUser) {
            const isPassValid = existUser.password === password;
            if (isPassValid) {
              return existUser;
            }
            throw new Error("Invalid password or credentials");
          } else {
            throw new Error("User not registered");
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
    GitHub,
    Google,
  ],
  basePath: BASE_PATH,
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
