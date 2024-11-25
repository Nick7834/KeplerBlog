import { SettingsList } from "@/components/shared/settings/settingsList";
import { TopBanner } from "@/components/shared/settings/topBanner";


export default function Settings() {
    return (
    <div className="mx-[50px] mt-[50px]">

        <h1 className="text-[#333333] dark:text-[#d9d9d9] text-3xl font-bold">Settings</h1>

        <TopBanner className="mt-[20px]" />

        <SettingsList />

    </div>
    );
}