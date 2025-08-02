import React from "react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="w-10 h-10 border-4 border-[#7391d5] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
