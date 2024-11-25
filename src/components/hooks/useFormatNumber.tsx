export const UseFormatNumber = (num: number) => {
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1);
    return parseFloat(formatted) + 'M';
  } else if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    if (parseFloat(formatted) === 1000) {
      return '999.9K'; 
    }
    return formatted + 'K';
  }
  return num.toString();
};