"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStoredCalendarSelection = exports.toggleCalendarSelectionInList = void 0;
const isImportedCalendar = (value) => {
    if (!value || typeof value !== 'object')
        return false;
    const candidate = value;
    return typeof candidate.id === 'string' && typeof candidate.title === 'string';
};
const toggleCalendarSelectionInList = (current, calendar) => {
    const exists = current.some((entry) => entry.id === calendar.id);
    if (exists) {
        return current.filter((entry) => entry.id !== calendar.id);
    }
    return [...current, calendar];
};
exports.toggleCalendarSelectionInList = toggleCalendarSelectionInList;
const parseStoredCalendarSelection = (raw) => {
    if (!raw)
        return [];
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter(isImportedCalendar);
    }
    catch {
        return [];
    }
};
exports.parseStoredCalendarSelection = parseStoredCalendarSelection;
