import { envValues } from "@/util/envValues";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
       clientId: envValues.googleClientId,
       clientSecret: envValues.googleClientSecret
    })
  ]
}

export default NextAuth(authOptions)