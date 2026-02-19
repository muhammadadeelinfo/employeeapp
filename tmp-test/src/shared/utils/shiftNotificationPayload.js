"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildShiftNotificationInsertPayload = void 0;
const shiftNotificationI18n_1 = require("./shiftNotificationI18n");
const buildShiftNotificationInsertPayload = (eventType, shiftId, detail, copy) => {
    const normalizedEvent = eventType.toUpperCase();
    return {
        title: (0, shiftNotificationI18n_1.getShiftNotificationTitle)(normalizedEvent, copy),
        detail,
        metadata: {
            shiftId,
            target: `/shift-details/${shiftId}`,
            event: normalizedEvent,
        },
    };
};
exports.buildShiftNotificationInsertPayload = buildShiftNotificationInsertPayload;
