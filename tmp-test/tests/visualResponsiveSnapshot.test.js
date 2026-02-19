"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const responsiveLayout_1 = require("../src/shared/utils/responsiveLayout");
const snapshot = [360, 393, 430, 768, 1024, 1366].map((width) => ({
    width,
    stack: (0, responsiveLayout_1.shouldStackForCompactWidth)(width),
    maxWidth: (0, responsiveLayout_1.getContentMaxWidth)(width) ?? null,
}));
assert_1.default.deepStrictEqual(snapshot, [
    { width: 360, stack: true, maxWidth: null },
    { width: 393, stack: true, maxWidth: null },
    { width: 430, stack: false, maxWidth: null },
    { width: 768, stack: false, maxWidth: 820 },
    { width: 1024, stack: false, maxWidth: 820 },
    { width: 1366, stack: false, maxWidth: 960 },
]);
console.log('tests/visualResponsiveSnapshot.test.ts OK');
