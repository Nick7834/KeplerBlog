"use client";
import Link from "next/link";
import React from "react";
import { IoHome } from "react-icons/io5";
import { HiTrendingUp } from "react-icons/hi";
import { MdPeopleAlt } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface Props {
  className?: string;
}

export interface MenuItem {
  name: string;
  href: string;
  svg: React.ReactNode;
}

export const Nav: React.FC<Props> = ({ className }) => {
  const namePage = usePathname();

  const navMenu: MenuItem[] = [
    {
      name: "Home",
      svg: <IoHome />,
      href: "/",
    },
    {
      name: "Trending",
      svg: <HiTrendingUp />,
      href: "/trending",
    },
    {
      name: "For You",
      svg: <FaNewspaper />,
      href: "/for-you",
    },
    {
      name: "My Subscriptions",
      svg: <MdPeopleAlt />,
      href: "/subscriptions",
    },
  ];

  return (
    <nav className={className}>
      <ul className="flex flex-col gap-8">
        {navMenu.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 w-full text-[#333333]  dark:text-[#d9d9d9] text-xl font-medium transition-all ease-in-out duration-[.3s] hover:text-[#7391d5] dark:hover:text-[#7391d5]",
                namePage === item.href && "dark:text-[#7391d5] text-[#7391d5]"
              )}
            >
              {item.svg}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
