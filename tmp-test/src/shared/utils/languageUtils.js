"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolate = exports.loadStoredLanguage = exports.resolveStoredLanguage = exports.isValidLanguage = exports.getLanguageStorageKey = exports.languageDefinitions = void 0;
exports.languageDefinitions = [
    { code: 'en', shortLabel: 'EN', flag: '🇬🇧', labelKey: 'languageEnglish' },
    { code: 'de', shortLabel: 'DE', flag: '🇩🇪', labelKey: 'languageGerman' },
];
const LANGUAGE_STORAGE_KEY_BASE = 'employee-portal-language';
const getLanguageStorageKey = (employeeId) => employeeId ? `${LANGUAGE_STORAGE_KEY_BASE}:${employeeId}` : null;
exports.getLanguageStorageKey = getLanguageStorageKey;
const isValidLanguage = (value) => exports.languageDefinitions.some((definition) => definition.code === value);
exports.isValidLanguage = isValidLanguage;
const resolveStoredLanguage = (value, fallback = 'en') => ((0, exports.isValidLanguage)(value) ? value : fallback);
exports.resolveStoredLanguage = resolveStoredLanguage;
const loadStoredLanguage = async (storage, key, fallback = 'en') => {
    if (!key)
        return fallback;
    try {
        const stored = await storage.getItem(key);
        return (0, exports.resolveStoredLanguage)(stored, fallback);
    }
    catch {
        return fallback;
    }
};
exports.loadStoredLanguage = loadStoredLanguage;
const interpolate = (value, vars) => {
    if (!vars)
        return value;
    return Object.entries(vars).reduce((text, [key, varValue]) => text.replace(`{${key}}`, String(varValue)), value);
};
exports.interpolate = interpolate;
