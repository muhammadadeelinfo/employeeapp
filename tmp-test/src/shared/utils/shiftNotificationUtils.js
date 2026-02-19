"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildShiftFilterValue = exports.shouldNotifyScheduleUpdate = exports.buildEventKey = exports.getShiftId = exports.hasRowChange = exports.readRowValue = exports.SHIFT_LOCATION_KEYS = exports.SHIFT_END_KEYS = exports.SHIFT_START_KEYS = void 0;
exports.SHIFT_START_KEYS = [
    'shiftStartingDate',
    'shiftstartingdate',
    'start_date',
    'start',
    'start_at',
];
exports.SHIFT_END_KEYS = [
    'shiftEndingDate',
    'shiftendingdate',
    'end_date',
    'end',
    'end_at',
];
exports.SHIFT_LOCATION_KEYS = [
    'location',
    'address',
    'shiftLocation',
    'shift_location',
    'objectAddress',
    'shiftAddress',
    'object_address',
];
const readRowValue = (row, keys) => {
    if (!row)
        return undefined;
    for (const key of keys) {
        const value = row[key];
        if (value === undefined || value === null)
            continue;
        if (typeof value === 'string') {
            if (value.trim())
                return value;
            continue;
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
    }
    return undefined;
};
exports.readRowValue = readRowValue;
const hasRowChange = (oldRow, newRow, keys) => (0, exports.readRowValue)(oldRow, keys) !== (0, exports.readRowValue)(newRow, keys);
exports.hasRowChange = hasRowChange;
const getShiftId = (row) => {
    if (!row)
        return undefined;
    const id = row.id ?? row.shiftId ?? row.shift_id ?? row.assignmentId ?? row.assignment_id;
    if (typeof id === 'string' && id.trim())
        return id;
    return undefined;
};
exports.getShiftId = getShiftId;
const buildEventKey = (shiftId, payload) => {
    const timestamp = payload.commit_timestamp ??
        payload.new?.created_at ??
        payload.new?.updated_at ??
        payload.old?.updated_at ??
        '';
    return `${shiftId}:${payload.eventType ?? 'unknown'}:${timestamp}`;
};
exports.buildEventKey = buildEventKey;
const shouldNotifyScheduleUpdate = (payload) => {
    if (!payload.eventType || payload.eventType.toUpperCase() !== 'UPDATE') {
        return false;
    }
    return ((0, exports.hasRowChange)(payload.old, payload.new, exports.SHIFT_START_KEYS) ||
        (0, exports.hasRowChange)(payload.old, payload.new, exports.SHIFT_END_KEYS) ||
        (0, exports.hasRowChange)(payload.old, payload.new, exports.SHIFT_LOCATION_KEYS));
};
exports.shouldNotifyScheduleUpdate = shouldNotifyScheduleUpdate;
const buildShiftFilterValue = (shiftIds) => Array.from(new Set(shiftIds.filter(Boolean)))
    .map((id) => `"${id.replace(/"/g, '\\"')}"`)
    .join(',');
exports.buildShiftFilterValue = buildShiftFilterValue;
