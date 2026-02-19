"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapShiftArray = exports.sortShiftsByStart = exports.mapShiftRecord = exports.defaultShiftEndIso = exports.defaultShiftStartIso = void 0;
const shiftConfirmationStatus_1 = require("../../lib/shiftConfirmationStatus");
const timeUtils_1 = require("../../shared/utils/timeUtils");
exports.defaultShiftStartIso = '2026-01-25T08:00:00Z';
exports.defaultShiftEndIso = '2026-01-25T12:00:00Z';
const normalizeStatus = (value) => {
    if (!value)
        return 'scheduled';
    const normalized = value.toLowerCase();
    if (normalized.includes('in-progress') || normalized.includes('progress'))
        return 'in-progress';
    if (normalized.includes('complete'))
        return 'completed';
    if (normalized.includes('block'))
        return 'blocked';
    if (normalized === 'scheduled')
        return 'scheduled';
    return 'scheduled';
};
const parseIso = (value) => {
    if (typeof value === 'string' && value.trim())
        return value;
    if (typeof value === 'number')
        return new Date(value).toISOString();
    if (value instanceof Date)
        return value.toISOString();
    return undefined;
};
const normalizeTimestampPair = (date, time, fallback) => {
    const isoDate = parseIso(date);
    const isoTime = parseIso(time);
    if (isoDate && isoTime) {
        const combinedDate = isoDate.split('T')[0];
        const combinedTime = isoTime.includes('T') ? isoTime.split('T')[1] : isoTime;
        const combined = new Date(`${combinedDate}T${combinedTime}`);
        if (!Number.isNaN(combined.getTime()))
            return combined.toISOString();
    }
    if (isoDate)
        return isoDate;
    if (isoTime)
        return isoTime;
    return fallback ?? exports.defaultShiftStartIso;
};
const pickValue = (row, keys) => {
    for (const key of keys) {
        const value = row[key];
        if (typeof value === 'string' && value.trim()) {
            return value;
        }
    }
    return undefined;
};
const pickFirstValue = (row, keys) => {
    for (const key of keys) {
        if (key in row && row[key] !== undefined && row[key] !== null) {
            return row[key];
        }
    }
    return undefined;
};
const mapShiftRecord = (raw) => {
    const start = normalizeTimestampPair(pickFirstValue(raw, ['shiftStartingDate', 'shiftstartingdate', 'start_date', 'start', 'start_at']), pickFirstValue(raw, ['shiftStartingTime', 'shiftstartingtime', 'start_time', 'startTime']), exports.defaultShiftStartIso);
    let end = normalizeTimestampPair(pickFirstValue(raw, ['shiftEndingDate', 'shiftendingdate', 'end_date', 'end', 'end_at']), pickFirstValue(raw, ['shiftEndingTime', 'shiftendingtime', 'end_time', 'endTime']), exports.defaultShiftEndIso);
    end = (0, timeUtils_1.ensureShiftEndAfterStart)(start, end);
    const title = pickValue(raw, ['title', 'shiftTitle', 'name', 'shift_name', 'ShiftTitle']) ?? 'Shift';
    const objectMeta = raw.object;
    const location = pickValue(raw, ['location', 'address', 'shiftLocation', 'shift_location']) ??
        pickValue(raw, ['objectAddress', 'shiftAddress', 'object_address']) ??
        (objectMeta ? pickValue(objectMeta, ['address']) : undefined) ??
        'TBD';
    const objectName = pickValue(raw, [
        'objectTitle',
        'objectName',
        'shiftObject',
        'shiftobject',
        'shiftLocation',
        'locationName',
    ]) ?? (objectMeta ? pickValue(objectMeta, ['title']) : undefined);
    const objectAddress = pickValue(raw, ['objectAddress', 'shiftAddress', 'address', 'object_address']) ??
        (objectMeta ? pickValue(objectMeta, ['address']) : undefined);
    const description = pickValue(raw, ['description', 'shiftDescription']);
    const statusValue = pickValue(raw, ['status', 'shiftStatus']) ?? 'scheduled';
    return {
        id: (typeof raw.id === 'string' && raw.id) || 'unknown',
        title,
        location,
        objectName,
        objectAddress,
        start,
        end,
        status: normalizeStatus(statusValue),
        description: description ?? undefined,
    };
};
exports.mapShiftRecord = mapShiftRecord;
const sortShiftsByStart = (list) => [...list].sort((a, b) => {
    const aTime = Number(new Date(a.start));
    const bTime = Number(new Date(b.start));
    if (Number.isNaN(aTime) && Number.isNaN(bTime))
        return 0;
    if (Number.isNaN(aTime))
        return 1;
    if (Number.isNaN(bTime))
        return -1;
    return aTime - bTime;
});
exports.sortShiftsByStart = sortShiftsByStart;
const mapShiftArray = (data, assignments) => {
    if (!data?.length)
        return [];
    const assignmentByShiftId = new Map();
    assignments?.forEach((assignment) => {
        if (assignment.shiftId) {
            assignmentByShiftId.set(assignment.shiftId, assignment);
        }
    });
    const parsed = [];
    data.forEach((row) => {
        const shift = (0, exports.mapShiftRecord)(row);
        if (shift.id === 'unknown')
            return;
        const assignment = assignmentByShiftId.get(shift.id);
        const confirmationStatus = (0, shiftConfirmationStatus_1.normalizeShiftConfirmationStatus)(assignment?.confirmationStatus);
        if (confirmationStatus === 'not published' || confirmationStatus === 'pending') {
            return;
        }
        parsed.push({
            ...shift,
            assignmentId: assignment?.assignmentId,
            confirmationStatus,
            confirmedAt: assignment?.confirmedAt,
        });
    });
    return (0, exports.sortShiftsByStart)(parsed);
};
exports.mapShiftArray = mapShiftArray;
