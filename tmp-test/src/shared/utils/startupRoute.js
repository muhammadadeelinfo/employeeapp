"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartupRoute = void 0;
const getStartupRoute = (hasUser) => hasUser ? '(tabs)/my-shifts' : '/startup';
exports.getStartupRoute = getStartupRoute;
