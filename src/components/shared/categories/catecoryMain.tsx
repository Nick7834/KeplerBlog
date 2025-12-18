import React from "react";
import { ItemBar } from "./itemBar";
import { Posts } from "./posts";

interface Props {
  className?: string;
}

export const CatecoryMain: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <ItemBar />

      <Posts />
    </div>
  );
};
