"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslationValue = exports.initializeMissingTranslationMonitoring = exports.createMissingTranslationLogger = exports.setMissingTranslationHandler = void 0;
let missingTranslationHandler = null;
const setMissingTranslationHandler = (handler) => {
    missingTranslationHandler = handler;
};
exports.setMissingTranslationHandler = setMissingTranslationHandler;
const createMissingTranslationLogger = (logger) => (payload) => {
    logger(`[i18n] Missing translation (${payload.reason}): ${payload.key}`);
};
exports.createMissingTranslationLogger = createMissingTranslationLogger;
const initializeMissingTranslationMonitoring = (logger = console.warn) => {
    (0, exports.setMissingTranslationHandler)((0, exports.createMissingTranslationLogger)(logger));
};
exports.initializeMissingTranslationMonitoring = initializeMissingTranslationMonitoring;
const getTranslationValue = (dictionary, key) => {
    const value = dictionary[key];
    if (typeof value === 'string' && value.length > 0) {
        return value;
    }
    if (typeof value === 'string' && value.length === 0) {
        missingTranslationHandler?.({ key, reason: 'empty' });
    }
    else {
        missingTranslationHandler?.({ key, reason: 'missing' });
    }
    return key;
};
exports.getTranslationValue = getTranslationValue;
