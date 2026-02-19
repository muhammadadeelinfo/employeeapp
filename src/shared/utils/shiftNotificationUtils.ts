type PostgresRealtimePayload = {
  eventType?: 'INSERT' | 'UPDATE' | 'DELETE' | string;
  commit_timestamp?: string;
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

export const SHIFT_START_KEYS = [
  'shiftStartingDate',
  'shiftstartingdate',
  'start_date',
  'start',
  'start_at',
];

export const SHIFT_END_KEYS = [
  'shiftEndingDate',
  'shiftendingdate',
  'end_date',
  'end',
  'end_at',
];

export const SHIFT_LOCATION_KEYS = [
  'location',
  'address',
  'shiftLocation',
  'shift_location',
  'objectAddress',
  'shiftAddress',
  'object_address',
];

export const readRowValue = (row: Record<string, unknown> | undefined, keys: string[]) => {
  if (!row) return undefined;
  for (const key of keys) {
    const value = row[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'string') {
      if (value.trim()) return value;
      continue;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
  }
  return undefined;
};

export const hasRowChange = (
  oldRow: Record<string, unknown> | undefined,
  newRow: Record<string, unknown> | undefined,
  keys: string[]
) => readRowValue(oldRow, keys) !== readRowValue(newRow, keys);

export const getShiftId = (row: Record<string, unknown> | undefined) => {
  if (!row) return undefined;
  const id = row.id ?? row.shiftId ?? row.shift_id ?? row.assignmentId ?? row.assignment_id;
  if (typeof id === 'string' && id.trim()) return id;
  return undefined;
};

export const buildEventKey = (shiftId: string, payload: PostgresRealtimePayload) => {
  const timestamp =
    payload.commit_timestamp ??
    (payload.new?.created_at as string | undefined) ??
    (payload.new?.updated_at as string | undefined) ??
    (payload.old?.updated_at as string | undefined) ??
    '';
  return `${shiftId}:${payload.eventType ?? 'unknown'}:${timestamp}`;
};

export const shouldNotifyScheduleUpdate = (payload: PostgresRealtimePayload) => {
  if (!payload.eventType || payload.eventType.toUpperCase() !== 'UPDATE') {
    return false;
  }
  return (
    hasRowChange(payload.old, payload.new, SHIFT_START_KEYS) ||
    hasRowChange(payload.old, payload.new, SHIFT_END_KEYS) ||
    hasRowChange(payload.old, payload.new, SHIFT_LOCATION_KEYS)
  );
};

export const buildShiftFilterValue = (shiftIds: string[]): string =>
  Array.from(new Set(shiftIds.filter(Boolean)))
    .map((id) => `"${id.replace(/"/g, '\\"')}"`)
    .join(',');
