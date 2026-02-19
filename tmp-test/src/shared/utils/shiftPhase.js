"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phaseMeta = exports.getShiftPhase = void 0;
const getShiftPhase = (startIso, endIso, now = new Date()) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    if (now > end) {
        return 'past';
    }
    if (now >= start) {
        return 'live';
    }
    return 'upcoming';
};
exports.getShiftPhase = getShiftPhase;
exports.phaseMeta = {
    past: {
        label: 'Past shift',
        icon: 'time-outline',
        color: '#6b7280',
        background: '#f1f5f9',
    },
    live: {
        label: 'Live now',
        icon: 'play-circle-outline',
        color: '#059669',
        background: '#ecfdf5',
    },
    upcoming: {
        label: 'Upcoming',
        icon: 'calendar-outline',
        color: '#2563eb',
        background: '#eff6ff',
    },
};
