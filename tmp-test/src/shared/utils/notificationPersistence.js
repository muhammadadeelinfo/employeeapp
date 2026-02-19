"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistNotificationRow = void 0;
const persistNotificationRow = async (client, employeeId, payload) => {
    const result = await client.from('notifications').insert({
        employee_id: employeeId,
        title: payload.title,
        detail: payload.detail,
        metadata: payload.metadata && Object.keys(payload.metadata).length
            ? payload.metadata
            : undefined,
    });
    const error = result && typeof result === 'object' && 'error' in result
        ? result.error ?? null
        : null;
    if (error) {
        throw error;
    }
};
exports.persistNotificationRow = persistNotificationRow;
