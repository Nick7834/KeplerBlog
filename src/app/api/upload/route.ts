import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/get-user-session';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/prisma/prisma-client';
import sharp from 'sharp';

export async function PUT(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;
  const userId = await getUserSession();

  if (!file || !type || !userId) {
    return NextResponse.json({ error: 'Missing file, type, or userId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId.id } });


    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let oldPublicId: string | null = null;

    if (type === 'avatar') {
      oldPublicId = getPublicIdFromUrl(user.profileImage || '');
    } else if (type === 'poster') {
      oldPublicId = getPublicIdFromUrl(user.poster || '');
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (oldPublicId) {
        const response = await cloudinary.api.resource(`uploads/${oldPublicId}`).catch(() => null);

        if (response && response.public_id) {
          const cloudinaryResponse = await cloudinary.uploader.destroy(`uploads/${oldPublicId}`);

          if (cloudinaryResponse.result !== 'ok') {
            return NextResponse.json({ error: 'Failed to delete old photo' }, { status: 500 });
          }
        }
    }

   if(file) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

      const cloudinaryUpload = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'uploads',
          }, 
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('No result from Cloudinary'));  
            resolve(result);
          }
        );
        uploadStream.end(webpBuffer);
      });

      const fileUrl = cloudinaryUpload.secure_url;

      const dataToUpdate: { profileImage?: string; poster?: string } = {};

      if (type === 'avatar') {
        dataToUpdate.profileImage = fileUrl;
      } else if (type === 'poster') {
        dataToUpdate.poster = fileUrl;
      } else {
        return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId.id },
        data: dataToUpdate,
      });

      return NextResponse.json({ user: updatedUser }, { status: 200 });
   } else {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
   }
  
  } catch (err) {
    console.error('Error uploading file or updating user:', err);
    return NextResponse.json({ error: 'File upload or database update failed' }, { status: 500 });
  }
}

function getPublicIdFromUrl(url: string): string {
  const urlParts = url.split('/');
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split('.')[0];
  return publicId;
}