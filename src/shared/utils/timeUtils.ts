export const ensureShiftEndAfterStart = (startIso: string, endIso: string): string => {
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return endIso;
  }
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  return endDate.toISOString();
};
