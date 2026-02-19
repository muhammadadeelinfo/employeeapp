"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const responsiveLayout_1 = require("../src/shared/utils/responsiveLayout");
assert_1.default.strictEqual((0, responsiveLayout_1.shouldStackForCompactWidth)(393), true);
assert_1.default.strictEqual((0, responsiveLayout_1.shouldStackForCompactWidth)(429), true);
assert_1.default.strictEqual((0, responsiveLayout_1.shouldStackForCompactWidth)(430), false);
assert_1.default.strictEqual((0, responsiveLayout_1.getContentMaxWidth)(393), undefined);
assert_1.default.strictEqual((0, responsiveLayout_1.getContentMaxWidth)(767), undefined);
assert_1.default.strictEqual((0, responsiveLayout_1.getContentMaxWidth)(768), 820);
assert_1.default.strictEqual((0, responsiveLayout_1.getContentMaxWidth)(1024), 820);
assert_1.default.strictEqual((0, responsiveLayout_1.getContentMaxWidth)(1200), 960);
assert_1.default.strictEqual((0, responsiveLayout_1.getContentMaxWidth)(1440), 960);
console.log('tests/responsiveLayout.test.ts OK');
