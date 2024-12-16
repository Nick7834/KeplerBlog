import { SettingsList } from "@/components/shared/settings/settingsList";
import { TopBanner } from "@/components/shared/settings/topBanner";
import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";


export default async function Settings() {
    const session = await getUserSession();

    if (!session) redirect('/');

    const user = await prisma.user.findUnique({ where: { id: session.id } });

    return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] mb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)]">

        <h1 className="text-[#333333] dark:text-[#d9d9d9] text-3xl font-bold">Settings</h1>

        <TopBanner className="mt-[20px]" user={user} />

        <SettingsList user={user!} className="max-w-[1250px] w-full" />

        <p className='kepler hidden mt-[50px] text-[#797d7e] dark:text-[#e3e3e3] text-sm text-center font-medium'>© {new Date().getFullYear()} KeplerMedia, Inc</p>

    </div>
    );
}