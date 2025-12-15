"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useCategories } from "./api/fetchCategory";
import { Category } from "@prisma/client";
import { iconsMap } from "@/lib/category";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  className?: string;
  categories: string;
  setCategories: React.Dispatch<React.SetStateAction<string>>;
}

export const Categories: React.FC<Props> = ({
  className,
  categories,
  setCategories,
}) => {
  const { data, error, isLoading } = useCategories();

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (isLoading) {
    return (
      <Skeleton className="mt-5 min-h-[42px] bg-[#c1c1c1] dark:bg-[#676767]" />
    );
  }

  return (
    <Select
      value={categories}
      onValueChange={setCategories}
    >
      <SelectTrigger
        className={cn(
          "select-none mt-5 text-[#333333] dark:text-[#e3e3e3] px-[12px] py-[20px] border border-solid border-neutral-300 dark:border-neutral-700 bg-neutral-300/75 dark:bg-neutral-800/75 rounded-[10px]",
          className
        )}
      >
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent className="max-h-[350px] border border-solid border-neutral-300 dark:border-neutral-700 bg-neutral-300 dark:bg-neutral-800 rounded-[10px] text-[#333333] dark:text-[#e3e3e3]">
        <SelectGroup>
          {data?.map((category: Category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="select-none"
            >
              <FontAwesomeIcon
                icon={iconsMap[category.icon as keyof typeof iconsMap]}
                className="mr-2"
              />
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
