"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureShiftEndAfterStart = void 0;
const ensureShiftEndAfterStart = (startIso, endIso) => {
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
exports.ensureShiftEndAfterStart = ensureShiftEndAfterStart;
