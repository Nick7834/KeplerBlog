import cloudinary from "@/lib/cloudinary";
import { getUserSession } from "@/lib/get-user-session";
import { getPublicIdFromUrl } from "@/lib/getPublicIdFromUrl";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import sharp from "sharp";


export async function PATCH(request: Request) {

     const userId = await getUserSession();

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const oldBackground = formData.get('oldBackground') as string | null;

    if (!file) {
      return NextResponse.json({ error: "Please select a file." }, { status: 400 });
    }

    if(file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please select an image file." }, { status: 400 });
    }

    try {

        const oldPhoto = getPublicIdFromUrl(oldBackground || '');
     
        if(oldPhoto) {
           const response = await cloudinary.api.resource(`customBackgroundChat/${oldPhoto}`).catch(() => null);

            if (response && response.public_id) {
                const cloudinaryResponse = await cloudinary.uploader.destroy(`customBackgroundChat/${oldPhoto}`);

                if(cloudinaryResponse.result !== 'ok') {
                    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
                }
            }
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const webpBuffer = await sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "customBackgroundChat",
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              if (!result) {
                return reject(new Error("No result from Cloudinary"));
              }
              resolve(result);
            }
          );
          uploadStream.end(webpBuffer);
        });

        const updateBackground = await prisma.user.update({
            where: {
                id: userId.id,
            },
            data: {
                customBackgroundChat: result.secure_url,
                backgroundChat: result.secure_url
            },
        });
        
        return NextResponse.json({ backgroundChat: updateBackground.customBackgroundChat, message: "Background updated successfully" }, { status: 200 });
        
    } catch (error) {
      console.warn(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}