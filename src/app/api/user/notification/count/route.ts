import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {

    const user = await getUserSession();

    if(!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {

        const unreadCount = await prisma.notification.count({
            where: {
                userId: user.id,
                isNew: true,  
            }
        });

        return NextResponse.json({ unreadCount,});

   } catch(error) {
        console.warn(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   }
 
}

export async function PUT() {
    const user = await getUserSession();

    if(!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
        const updatedNotification = await prisma.notification.updateMany({
            where: { userId: user.id, isNew: true },
            data: { isNew: false }
        });

        return NextResponse.json({ updatedNotification });

   } catch(error) {
        console.warn(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}