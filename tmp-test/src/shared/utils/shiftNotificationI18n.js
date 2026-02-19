"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShiftNotificationTitle = void 0;
const getShiftNotificationTitle = (eventType, copy) => {
    const normalized = eventType.toUpperCase();
    if (normalized === 'DELETE') {
        return copy.shiftRemoved;
    }
    if (normalized === 'UPDATE') {
        return copy.shiftScheduleChanged;
    }
    return copy.shiftPublished;
};
exports.getShiftNotificationTitle = getShiftNotificationTitle;
