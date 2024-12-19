import { formatDistanceToNow } from "date-fns";

export const getShortTimeAgo = (date: Date): string => {
    const timeDiffInSeconds = (new Date().getTime() - date.getTime()) / 1000;
  
    if (timeDiffInSeconds < 60) {
      return '1m ago';
    }
  
    const timeAgo = formatDistanceToNow(date, { addSuffix: true })
      .replace('minutes', 'm')
      .replace('minute', 'm')
      .replace('hours', 'h')
      .replace('hour', 'h')
      .replace('days', 'days')
      .replace('day', 'day')
      .replace('months', 'mo')
      .replace('month', 'mo')
      .replace('years', 'years')
      .replace('year', 'year')
      .replace('about ', ''); 
  
    return timeAgo.replace(' ago', ''); 
};