import { isWithinInterval } from "date-fns";
import { useMemo } from "react";

export const useIsYearlyEventActive = () => {
  const isAvailable = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let startYear = currentYear;
    let endYear = currentYear;

    if (currentMonth === 0) { 
      startYear = currentYear - 1;
    } else { 
      endYear = currentYear + 1;
    }

    const startDate = new Date(startYear, 11, 24); 
    const endDate = new Date(endYear, 0, 12);

    return isWithinInterval(now, {
      start: startDate,
      end: endDate,
    });
  }, []);

  return isAvailable;
};