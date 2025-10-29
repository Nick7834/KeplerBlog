export const UseFormatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    const value = num / 1_000_000;
    const formatted =
      value % 1 === 0
        ? value.toFixed(0)
        : value.toFixed(1).replace(/\.0$/, '');
    return `${formatted}M`;
  }

  if (num >= 1_000) {
    const value = num / 1_000;
    const diff = value - Math.floor(value);
    const formatted =
      diff < 0.1
        ? Math.floor(value).toString()
        : value.toFixed(1).replace(/\.0$/, '');

    return `${formatted}K`;
  }

  return num.toString();
};