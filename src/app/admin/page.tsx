import { AdminMain } from "@/components/shared/admin/components/adminMain";
import { getUserSession } from "@/lib/get-user-session";
import { redirect } from "next/navigation";
import { MdAdminPanelSettings } from "react-icons/md";

export default async function CareatePost() {
  const session = await getUserSession();

  if (session?.role !== "admin") redirect("/");

  return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] pb-[30px] px-[50px] max-[750px]:px-[15px] max-[650px]:mx-0 flex flex-col justify-center flex-1">
      <h1 className="flex items-center gap-2 text-[25px] font-semibold text-[#333333] dark:text-[#d9d9d9]">
        <MdAdminPanelSettings size={25} /> Admin Panel
      </h1>

      <AdminMain />
    </div>
  );
}
