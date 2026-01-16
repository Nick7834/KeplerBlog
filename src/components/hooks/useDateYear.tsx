import { useEffect, useState } from "react";

export const useDateYear = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return false;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const start = new Date(year, 11, 1);
  const end = new Date(year, 0, 15);
  return currentDate >= start || currentDate <= end;
};