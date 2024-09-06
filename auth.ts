import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/utils/connectDB";
import { user } from "@/models/model";
import { comparePassword } from "@/utils/comparePassword";
import { IUser } from "@/app/types/types";

export const BASE_PATH = "/api/auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/naija_memes/auth/signin",
    signOut: "/naija_memes/auth/signout",
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials, request) => {
        const { userId, password }: any = credentials;
        try {
          await connectDB();
          const existUser: IUser | null = await user.findOne({
            $or: [{ email: userId }, { username: userId }],
          });
          if (existUser) {
            let isPassValid = await comparePassword(existUser.email, password);
            if (isPassValid) {
              return existUser;
            }
            throw new Error("Invalid password or credentials");
            return null;
          } else {
            throw new Error("User not registered");
            return null;
          }
        } catch (error: any) {
          console.error("Error during authorization:", error.message);
            return null;
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
