export type ShiftNotificationI18nCopy = {
  shiftPublished: string;
  shiftRemoved: string;
  shiftScheduleChanged: string;
  recentShiftUpdate: string;
};

export const getShiftNotificationTitle = (
  eventType: string,
  copy: ShiftNotificationI18nCopy
) => {
  const normalized = eventType.toUpperCase();
  if (normalized === 'DELETE') {
    return copy.shiftRemoved;
  }
  if (normalized === 'UPDATE') {
    return copy.shiftScheduleChanged;
  }
  return copy.shiftPublished;
};
