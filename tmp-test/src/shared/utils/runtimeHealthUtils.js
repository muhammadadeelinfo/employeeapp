"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMissingTableError = exports.buildNotificationsHealthEndpoint = exports.getRuntimeConfigIssuesFromExtra = exports.parseBooleanExtra = exports.REQUIRED_EXPO_EXTRA_KEYS = void 0;
exports.REQUIRED_EXPO_EXTRA_KEYS = ['supabaseUrl', 'supabaseAnonKey', 'apiBaseUrl'];
const parseBooleanExtra = (value) => {
    if (typeof value === 'boolean')
        return value;
    if (typeof value !== 'string')
        return false;
    const normalized = value.trim().toLowerCase();
    return ['1', 'true', 'yes', 'on'].includes(normalized);
};
exports.parseBooleanExtra = parseBooleanExtra;
const getRuntimeConfigIssuesFromExtra = (extra) => {
    const issues = [];
    exports.REQUIRED_EXPO_EXTRA_KEYS.forEach((key) => {
        const value = extra[key];
        if (typeof value !== 'string' || !value.trim()) {
            issues.push(`Missing required runtime config: ${key}`);
        }
    });
    return issues;
};
exports.getRuntimeConfigIssuesFromExtra = getRuntimeConfigIssuesFromExtra;
const buildNotificationsHealthEndpoint = (supabaseUrl) => `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/notifications?select=id&limit=1`;
exports.buildNotificationsHealthEndpoint = buildNotificationsHealthEndpoint;
const isMissingTableError = (status, body) => status === 404 && body.includes('PGRST205');
exports.isMissingTableError = isMissingTableError;
