import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/get-user-session";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import sharp from "sharp";
import { getInitialPosts } from "@/server/posts";
import { notificationQueue } from "@/lib/queue";
import { checkBan } from "@/lib/checkBan";
import { postRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  const userId = await getUserSession();
  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  await checkBan(userId.id);

  const { success } = await postRateLimit.limit(userId.id);

  if (!success) {
    return NextResponse.json(
      { error: "Too many attempts. Wait a minute." },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = JSON.parse(
      formData.get("content") as string
    ) as Prisma.JsonValue | null;
    const photos = formData.getAll("photos") as File[];
    const avatarUser = formData.get("avatarUser") as string | null;
    const userName = formData.get("userName") as string;
    const categories = formData.get("categories") as string;

    if (!title || !content || !categories) {
      return NextResponse.json(
        { error: "Missing title or content" },
        { status: 400 }
      );
    }

    if (photos.length > 5) {
      return NextResponse.json({ error: "Too many photos" }, { status: 400 });
    }

    for (const photo of photos) {
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
      }

      if (!photo.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only images are allowed" },
          { status: 400 }
        );
      }
    }

    const uploadPhoto = async (photo: File) => {
      const buffer = Buffer.from(await photo.arrayBuffer());

      const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

      return new Promise<{ secure_url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "posts",
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
    };

    const uploadedPhotos = await Promise.all(photos.map(uploadPhoto));
    const photoUrls = uploadedPhotos.map((photo) => photo.secure_url);

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        image: photoUrls,
        authorId: userId.id,
        categoryId: categories,
      },
    });

    notificationQueue.add("send_notifications", {
      userId: userId.id,
      userName,
      avatarUser,
      newPostId: newPost.id,
      title,
      photoUrls,
    });

    return NextResponse.json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("Error uploading files or saving post:", error);
    return NextResponse.json(
      { error: "Upload or database operation failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const userId = url.searchParams.get("userId") || "";

    const postsWithLikedStatus = await getInitialPosts(page, limit, userId);

    return NextResponse.json({ posts: postsWithLikedStatus });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
