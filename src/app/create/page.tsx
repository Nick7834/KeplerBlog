import { CreatePostInput } from "@/components/shared/сreatePostInput";
import { getUserSession } from "@/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function CareatePost() {
  const session = await getUserSession();

  if (!session) redirect("/");

  return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] pb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)]">
      <h1 className="text-[#333333] dark:text-[#d9d9d9] text-2xl font-bold">
        Create post
      </h1>

      <CreatePostInput />
    </div>
  );
}
