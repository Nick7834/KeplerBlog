import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserSession();

    if(!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { id: notificationId } = await params;

    if(!notificationId) {
        return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    try {
        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId, userId: user.id },
            data: { isRead: true }
        });

        return NextResponse.json({ updatedNotification });

   } catch(error) {
        console.warn(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await getUserSession();

    if(!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { id: notificationId } = await params;

    if(!notificationId) {
        return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }


    try {

        const deletedNotification = await prisma.notification.delete({
            where: { id: notificationId, userId: user.id }
        });

        return NextResponse.json({ deletedNotification });

    } catch(error) {
        console.warn(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }

}