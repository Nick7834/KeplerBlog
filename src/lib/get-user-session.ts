import { getServerSession } from "next-auth";
import { authOptions } from "./autch";


export const getUserSession = async () => {
    const session = await getServerSession(authOptions);
    return session?.user ?? null;
}