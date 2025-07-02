import { differenceInMonths, format, isThisYear, isToday } from "date-fns";

export const formatChatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  if (isToday(date)) return format(date, "HH:mm");

  const month = differenceInMonths(now, date);

  if(month < 1 && isThisYear(date)) {
    return format(date, 'eee d');
  }

  if (isThisYear(date)) {
    return format(date, 'd MMM');
  }

   return format(date, 'd MMM, yyyy');
};
