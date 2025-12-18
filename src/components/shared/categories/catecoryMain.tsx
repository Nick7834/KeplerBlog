import React, { Suspense } from "react";
import { ItemBar } from "./itemBar";
import { Posts } from "./posts";

interface Props {
  className?: string;
}

export const CatecoryMain: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Suspense>
        <ItemBar />
      </Suspense>

      <Posts />
    </div>
  );
};