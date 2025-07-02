import { format, isToday, isValid } from "date-fns";

export function formatLastSeen(timestamp?: number): string {
  if (!timestamp || isNaN(timestamp)) {
    return "Last seen recently";
  }

  const date = new Date(timestamp);

  if (!isValid(date)) {
    return "Last seen recently";
  }

  if (isToday(date)) {
    return `Last seen today at ${format(date, "HH:mm")}`;
  }

  return `Last seen on ${format(date, "MMMM d, yyyy")}`;
}
