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
        authorize: async(credentials, request) => {
        const { userId, password } = credentials;
        try {
          connectDB();
          const existUser = await user.findOne({
            $or: [{ email: userId }, { username: userId }],
          });
          if (existUser) {
            const isPassValid = existUser.password === password;
            if (isPassValid) {
              return existUser;
            }
            throw new Error("invalid password or credentiials");
            return null;
          } else {
            throw new Error("user not registered");
            return null;
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
        return null;
      },
    }),
    GitHub,
    Google,
  ],
  basePath: BASE_PATH,
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
