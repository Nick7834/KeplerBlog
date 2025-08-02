import { EditPostInput } from "@/components/shared/settings/editPostInput";
import { Loader } from "@/components/ui/loader";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: id } = await params;

  const user = await getUserSession();

  if (!user) redirect("/");

  if (!id) redirect("/");

  const isValidObjectId = /^[a-f\d]{24}$/i.test(id);
  if (!isValidObjectId) redirect("/");

  const posts = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!posts) redirect("/");

  return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] pb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)]">
      <Suspense fallback={<Loader />}>
        <EditPostInput post={posts} />
      </Suspense>
    </div>
  );
}
