import cloudinary from "@/lib/cloudinary";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: postId } = await params;
    const userId = await getUserSession();

  if (!postId) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
      where: {
          id: postId,
      },
  });

  if (userId.id !== post?.authorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
      const formData = await request.formData();
      const title = formData.get('title') as string | null;
      const content = JSON.parse(formData.get('content') as string) as Prisma.JsonValue | null;
      const oldPhoto = formData.getAll('oldPhoto') as string[]; 
      const newPhoto = formData.getAll('newPhotos') as File[];  

      if (!title || !content) {
          return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
      }

      if(newPhoto.length + oldPhoto.length > 5) {
          return NextResponse.json({ error: 'You can upload a maximum of 5 photos' }, { status: 400 });
      }

      const uploadPhoto = async (photo: File) => {
          const buffer = Buffer.from(await photo.arrayBuffer());

          const webpBuffer = await sharp(buffer)
              .webp({ quality: 80 })
              .toBuffer();

          return new Promise<{ secure_url: string }>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {
                      folder: 'posts',
                  },
                  (error, result) => {
                      if (error) {
                          return reject(error);
                      }
                      if (!result) {
                          return reject(new Error('No result from Cloudinary'));
                      }
                      resolve(result);
                  }
              );
              uploadStream.end(webpBuffer);
          });
      };

      const newPhotos = newPhoto.length > 0 ? await Promise.all(newPhoto.map(uploadPhoto)) : [];
      const newPhotoUrls = newPhotos.map((photo) => photo.secure_url);
      
      const finalPhotos = [...oldPhoto, ...newPhotoUrls];


      const newPost = await prisma.post.update({
          where: {
              id: postId,
          },
          data: {
              title,
              content,
              image: finalPhotos, 
          },
      });

      return NextResponse.json({ post: newPost });
  } catch (error) {
      console.error('Error uploading files or saving post:', error);
      return NextResponse.json({ error: 'Upload or database operation failed' }, { status: 500 });
  }
}
