"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const mapUrl_1 = require("../src/shared/utils/mapUrl");
assert_1.default.strictEqual((0, mapUrl_1.buildMapsSearchUrl)(undefined), undefined);
assert_1.default.strictEqual((0, mapUrl_1.buildMapsSearchUrl)('   '), undefined);
assert_1.default.strictEqual((0, mapUrl_1.buildMapsSearchUrl)('Public Library Berlin, Robert-Rossle-Strase 6'), 'https://www.google.com/maps/search/?api=1&query=Public%20Library%20Berlin%2C%20Robert-Rossle-Strase%206');
assert_1.default.strictEqual((0, mapUrl_1.buildMapsSearchUrl)('  10 Downing St, London  '), 'https://www.google.com/maps/search/?api=1&query=10%20Downing%20St%2C%20London');
console.log('tests/maps.test.ts OK');
