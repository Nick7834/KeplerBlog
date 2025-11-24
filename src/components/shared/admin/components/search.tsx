import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Button, Input } from "../..";
import { cn } from "@/lib/utils";
import { useSearchAdmin } from "@/store/adminSearch";

interface Props {
  className?: string;
}

export const Search: React.FC<Props> = ({ className }) => {
  const { search, setSearch } = useSearchAdmin();
  const [input, setInput] = useState(search);
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    const handClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocus(false);
      }
    };

    document.addEventListener("mousedown", handClickOutside);

    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [focus]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(input);
  }

  return (
    <form
      className={"w-full"}
      onSubmit={(e) => handleSubmit(e)}
    >
      <label
        ref={ref}
        className={cn(
          "cursor-text w-full flex items-center gap-2 p-[12px] border border-solid bg-neutral-300/75 dark:bg-neutral-800/75 rounded-[10px]",
          focus ? "border-[#333333] dark:border-[#e3e3e3]" : "",
          className
        )}
      >
        <FiSearch
          size={16}
          className="text-[#333333] dark:text-[#e3e3e3]"
        />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocus(true)}
          type="text"
          placeholder="Search"
          className="outline-none p-0 h-fit rounded-none border-0 w-full bg-transparent text-[#333333] dark:text-[#e3e3e3] text-base font-medium"
        />
        <Button
          type="button"
          onClick={() => (setSearch(""), setInput(""))}
          variant="outline"
          className="search-button-mob p-0 h-fit hidden bg-transparent border-0 hover:bg-transparent [&_svg]:size-[20px]"
        ></Button>
      </label>
    </form>
  );
};
