import cloudinary from "@/lib/cloudinary";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const userId = await getUserSession();

    if (!userId) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const photoUrl = searchParams.get("url");

    if (!type || !photoUrl) {
        return NextResponse.json({ error: "Missing type or photo URL" }, { status: 400 });
    }

    if (type !== 'avatar' && type !== 'poster') {
        return NextResponse.json({ error: "Invalid type. Must be 'avatar' or 'poster'." }, { status: 400 });
    }

   try {
        const publicId = getPublicIdFromUrl(photoUrl);
        
        const response = await cloudinary.api.resource(`uploads/${publicId}`).catch(() => null);

        if (response && response.public_id) {
            const cloudinaryResponse = await cloudinary.uploader.destroy(`uploads/${publicId}`);

            if(cloudinaryResponse.result !== 'ok') {
                return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
            }
        }

        const updateData = {
            [type === 'avatar' ? 'profileImage' : 'poster']: null
        };

        await prisma.user.update({
            where: {
                id: userId.id
            },
            data: updateData
        })

        return NextResponse.json({ message: "Photo deleted successfully" });
        
   } catch (error) {
        console.error("Error deleting photo:", error);
       return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
   }
}

function getPublicIdFromUrl(url: string): string {
    const urlParts = url.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
}