import { envValues } from "@/util/envValues";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
 
  providers: [
    GoogleProvider({
       clientId: envValues.googleClientId,
       clientSecret: envValues.googleClientSecret
    })
  ]
}

export default NextAuth(authOptions)