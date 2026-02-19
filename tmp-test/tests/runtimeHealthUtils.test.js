"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const runtimeHealthUtils_1 = require("../src/shared/utils/runtimeHealthUtils");
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)(true), true);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)(false), false);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)('true'), true);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)(' YES '), true);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)('1'), true);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)('on'), true);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)('false'), false);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)('0'), false);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)(1), false);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.parseBooleanExtra)(undefined), false);
assert_1.default.deepStrictEqual((0, runtimeHealthUtils_1.getRuntimeConfigIssuesFromExtra)({
    supabaseUrl: 'https://example.supabase.co',
    supabaseAnonKey: 'anon',
    apiBaseUrl: 'https://api.example.com',
}), []);
assert_1.default.deepStrictEqual((0, runtimeHealthUtils_1.getRuntimeConfigIssuesFromExtra)({}), [
    'Missing required runtime config: supabaseUrl',
    'Missing required runtime config: supabaseAnonKey',
    'Missing required runtime config: apiBaseUrl',
]);
assert_1.default.deepStrictEqual((0, runtimeHealthUtils_1.getRuntimeConfigIssuesFromExtra)({
    supabaseUrl: ' ',
    supabaseAnonKey: '',
    apiBaseUrl: 'ok',
}), [
    'Missing required runtime config: supabaseUrl',
    'Missing required runtime config: supabaseAnonKey',
]);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.buildNotificationsHealthEndpoint)('https://x.supabase.co'), 'https://x.supabase.co/rest/v1/notifications?select=id&limit=1');
assert_1.default.strictEqual((0, runtimeHealthUtils_1.buildNotificationsHealthEndpoint)('https://x.supabase.co///'), 'https://x.supabase.co/rest/v1/notifications?select=id&limit=1');
assert_1.default.strictEqual((0, runtimeHealthUtils_1.isMissingTableError)(404, '...PGRST205...'), true);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.isMissingTableError)(404, 'some other error'), false);
assert_1.default.strictEqual((0, runtimeHealthUtils_1.isMissingTableError)(500, 'PGRST205'), false);
console.log('tests/runtimeHealthUtils.test.ts OK');
