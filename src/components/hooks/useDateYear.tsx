export const useDateYear = () => {
  const currentYear = new Date();
  const currentDate = new Date();

  const start = new Date(currentYear.getFullYear(), 11, 1);
  const end = new Date(currentYear.getFullYear(), 0, 15);

  const isInSeason = currentDate >= start || currentDate <= end;

  return isInSeason;
};
