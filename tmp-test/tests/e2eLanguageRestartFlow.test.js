"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const languageUtils_1 = require("../src/shared/utils/languageUtils");
const startupRoute_1 = require("../src/shared/utils/startupRoute");
const run = async () => {
    const mem = new Map();
    const userId = 'employee-42';
    const key = (0, languageUtils_1.getLanguageStorageKey)(userId);
    assert_1.default.ok(key);
    mem.set(key, 'de');
    const storage = {
        getItem: async (storageKey) => mem.get(storageKey) ?? null,
    };
    const languageAfterRestart = await (0, languageUtils_1.loadStoredLanguage)(storage, key);
    assert_1.default.strictEqual(languageAfterRestart, 'de');
    assert_1.default.strictEqual((0, startupRoute_1.getStartupRoute)(false), '/startup');
    assert_1.default.strictEqual((0, startupRoute_1.getStartupRoute)(true), '(tabs)/my-shifts');
};
void run()
    .then(() => {
    console.log('tests/e2eLanguageRestartFlow.test.ts OK');
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
