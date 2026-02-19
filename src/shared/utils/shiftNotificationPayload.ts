import type { ShiftNotificationI18nCopy } from './shiftNotificationI18n';
import { getShiftNotificationTitle } from './shiftNotificationI18n';

export type ShiftNotificationInsertPayload = {
  title: string;
  detail: string;
  metadata: {
    shiftId: string;
    target: string;
    event: string;
  };
};

export const buildShiftNotificationInsertPayload = (
  eventType: string,
  shiftId: string,
  detail: string,
  copy: ShiftNotificationI18nCopy
): ShiftNotificationInsertPayload => {
  const normalizedEvent = eventType.toUpperCase();
  return {
    title: getShiftNotificationTitle(normalizedEvent, copy),
    detail,
    metadata: {
      shiftId,
      target: `/shift-details/${shiftId}`,
      event: normalizedEvent,
    },
  };
};
