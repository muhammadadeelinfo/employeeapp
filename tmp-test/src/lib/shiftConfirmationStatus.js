"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShiftConfirmationStatusLabel = exports.normalizeShiftConfirmationStatus = void 0;
const canonical = [
    'not published',
    'pending',
    'scheduled',
    'assigned',
    'published',
    'confirmed',
    'confirmed by employee',
];
const labels = {
    'not published': 'Not published',
    pending: 'Pending',
    scheduled: 'Scheduled',
    assigned: 'Assigned',
    published: 'Published',
    confirmed: 'Confirmed',
    'confirmed by employee': 'Confirmed by employee',
};
const synonyms = {
    'not published': 'not published',
    'not_published': 'not published',
    'not-published': 'not published',
    pending: 'pending',
    scheduled: 'scheduled',
    assigned: 'assigned',
    published: 'published',
    confirmed: 'confirmed',
    'confirmed by employee': 'confirmed by employee',
    'confirmed_by_employee': 'confirmed by employee',
    'confirmed-by-employee': 'confirmed by employee',
};
const normalizeShiftConfirmationStatus = (value) => {
    if (!value)
        return 'not published';
    const normalized = value.trim().toLowerCase();
    const normalizedSpaces = normalized.replace(/[_-]+/g, ' ');
    return synonyms[normalizedSpaces] ?? synonyms[normalized] ?? 'not published';
};
exports.normalizeShiftConfirmationStatus = normalizeShiftConfirmationStatus;
const getShiftConfirmationStatusLabel = (status) => labels[status];
exports.getShiftConfirmationStatusLabel = getShiftConfirmationStatusLabel;
