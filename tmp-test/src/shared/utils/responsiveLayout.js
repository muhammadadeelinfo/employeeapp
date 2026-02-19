"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentMaxWidth = exports.shouldStackForCompactWidth = exports.DESKTOP_BREAKPOINT = exports.TABLET_BREAKPOINT = exports.MOBILE_STACK_BREAKPOINT = void 0;
exports.MOBILE_STACK_BREAKPOINT = 430;
exports.TABLET_BREAKPOINT = 768;
exports.DESKTOP_BREAKPOINT = 1200;
const shouldStackForCompactWidth = (width) => width < exports.MOBILE_STACK_BREAKPOINT;
exports.shouldStackForCompactWidth = shouldStackForCompactWidth;
const getContentMaxWidth = (width) => {
    if (width >= exports.DESKTOP_BREAKPOINT)
        return 960;
    if (width >= exports.TABLET_BREAKPOINT)
        return 820;
    return undefined;
};
exports.getContentMaxWidth = getContentMaxWidth;
