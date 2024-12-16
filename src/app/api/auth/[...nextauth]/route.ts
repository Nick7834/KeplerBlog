import { authOptions } from "@/lib/autch"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions) as never
export { handler as GET, handler as POST }

