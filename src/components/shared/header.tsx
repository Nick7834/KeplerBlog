"use client";
import { cn } from "@/lib/utils";
import { AutchModalBlock } from "./autchModalBlock";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import { Search } from "./search";
import Link from "next/link";
import { useUserAvatar } from "@/store/user";
import { useSettingsMessage } from "@/store/settingsMessage";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [searchMobOpen, setSearchMobOpen] = useState(false);
  const { setAvatarUser, setUserName, setBackgroundChat } = useUserAvatar();
  const {
    setBackgroundColorMessage,
    setTextColor,
    setFontSize,
    setRadiusSize,
  } = useSettingsMessage();

  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const { data } = await axios.get(`/api/user/${session.user.id}`);
          setUser(data);
          setAvatarUser(data.profileImage);
          setUserName(data.username);
          setBackgroundChat(data.backgroundChat);
          setRadiusSize(data.settings?.radiusSize);

          setBackgroundColorMessage(data.settings?.backgroundColor);
          setTextColor(data.settings?.textColor);
          setFontSize(data.settings?.fontSize);
        } catch (error) {
          console.error("Request failed:", error);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.id, setAvatarUser, setBackgroundChat, setUserName]);

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-[20px] py-[clamp(0.938rem,0.599rem+0.83vw,1.25rem)] px-[clamp(0.938rem,-1.432rem+5.83vw,3.125rem)] border-b border-solid border-[#D3D3D3] dark:border-white/80",
        className
      )}
    >
      <div className="absolute top-0 left-0 bg-[#EAEAEA]/80 dark:bg-[#171717]/90 backdrop-blur-3xl w-full h-full z-[-1]"></div>
      <Link
        href="/"
        className='logo-mob hidden items-center w-fit text-[#848484] dark:text-[#e3e3e3] text-5xl font-medium font-["Protest_Guerrilla"]'
      >
        K <span className='text-[#7391d5] font-["Protest_Guerrilla"]'>B</span>
      </Link>

      <Search
        setSearchMobOpen={setSearchMobOpen}
        searchMobOpen={searchMobOpen}
      />

      <AutchModalBlock
        session={session}
        status={status}
        user={user}
        setSearchMobOpen={setSearchMobOpen}
      />
    </header>
  );
};
