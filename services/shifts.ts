import { PostgrestError, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type ShiftStatus = 'scheduled' | 'in-progress' | 'completed' | 'blocked';

export type Shift = {
  id: string;
  title: string;
  location: string;
  start: string;
  end: string;
  status: ShiftStatus;
  description?: string;
};

const fallbackShifts: Shift[] = [
  {
    id: 'shift-1',
    title: 'Morning Lobby Coverage',
    location: 'Headquarters Lobby',
    start: '2026-01-25T08:00:00Z',
    end: '2026-01-25T12:00:00Z',
    status: 'scheduled',
    description: 'Greet visitors, issue badges, and keep the area tidy.',
  },
  {
    id: 'shift-2',
    title: 'Warehouse AMS Team',
    location: 'Warehouse B',
    start: '2026-01-24T16:00:00Z',
    end: '2026-01-24T20:00:00Z',
    status: 'in-progress',
    description: 'Cycle-count oversight and loading dock coordination.',
  },
];

const normalizeStatus = (value?: string): ShiftStatus => {
  if (!value) return 'scheduled';
  const normalized = value.toLowerCase();
  if (normalized.includes('in-progress') || normalized.includes('progress')) return 'in-progress';
  if (normalized.includes('complete')) return 'completed';
  if (normalized.includes('block')) return 'blocked';
  if (normalized === 'scheduled') return 'scheduled';
  return 'scheduled';
};

const parseIso = (value?: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return new Date(value).toISOString();
  if (value instanceof Date) return value.toISOString();
  return undefined;
};

const normalizeTimestampPair = (date?: unknown, time?: unknown, fallback?: string): string => {
  const isoDate = parseIso(date);
  const isoTime = parseIso(time);
  if (isoDate && isoTime) {
    const combinedDate = isoDate.split('T')[0];
    const combinedTime = isoTime.includes('T') ? isoTime.split('T')[1] : isoTime;
    const combined = new Date(`${combinedDate}T${combinedTime}`);
    if (!Number.isNaN(combined.getTime())) return combined.toISOString();
  }
  if (isoDate) return isoDate;
  if (isoTime) return isoTime;
  return fallback ?? fallbackShifts[0].start;
};

const pickValue = (row: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return undefined;
};

const mapShiftRecord = (raw: Record<string, unknown>): Shift => {
  const start = normalizeTimestampPair(
    raw.start_date ?? raw.start ?? raw.start_time ?? raw.start_at,
    raw.start_time ?? raw.shiftStartingTime ?? raw.startTime,
    fallbackShifts[0].start
  );
  const end = normalizeTimestampPair(
    raw.end_date ?? raw.end ?? raw.end_time ?? raw.end_at,
    raw.end_time ?? raw.shiftEndingTime ?? raw.endTime,
    fallbackShifts[0].end
  );
  const title =
    pickValue(raw, ['title', 'shiftTitle', 'name', 'shift_name']) ?? 'Shift';
  const location = pickValue(raw, ['location', 'address', 'shiftLocation']) ?? 'TBD';
  const description = pickValue(raw, ['description', 'shiftDescription']);
  const statusValue = pickValue(raw, ['status', 'shiftStatus']) ?? 'scheduled';
  return {
    id: (typeof raw.id === 'string' && raw.id) || 'unknown',
    title,
    location,
    start,
    end,
    status: normalizeStatus(statusValue),
    description: description ?? undefined,
  };
};

const sortShiftsByStart = (list: Shift[]): Shift[] =>
  [...list].sort((a, b) => {
    const aTime = Number(new Date(a.start));
    const bTime = Number(new Date(b.start));
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return aTime - bTime;
  });

const mapShiftArray = (data?: Record<string, unknown>[]): Shift[] => {
  if (!data?.length) return [];
  const parsed = data.map(mapShiftRecord).filter((shift) => shift.id !== 'unknown');
  return sortShiftsByStart(parsed);
};

const isMissingColumnError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as PostgrestError).code === '42703';

const tryFetchShiftAssignments = async (employeeId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('shift_assignments')
    .select('shiftId')
    .eq('employeeId', employeeId);

  if (error) {
    if (isMissingColumnError(error)) {
      return [];
    }
    throw error;
  }

  return (data ?? [])
    .map((row) => (typeof row.shiftId === 'string' ? row.shiftId : undefined))
    .filter(Boolean) as string[];
};

const tryFetchShiftsByIds = async (ids: string[]): Promise<Record<string, unknown>[]> => {
  if (!ids.length) return [];
  const { data, error } = await supabase.from('shifts').select('*').in('id', ids);

  if (error) {
    throw error;
  }

  return data ?? [];
};

const fetchShiftAssignments = async (employeeId?: string): Promise<Shift[]> => {
  if (!employeeId) {
    return [];
  }

  const ids = await tryFetchShiftAssignments(employeeId);
  if (!ids.length) {
    return [];
  }

  const shiftRows = await tryFetchShiftsByIds(ids);
  return mapShiftArray(shiftRows);
};

export const getShifts = async (employeeId?: string): Promise<Shift[]> => {
  if (!supabase) {
    throw new Error('Supabase client not configured');
  }

  return await fetchShiftAssignments(employeeId);
};

type ShiftSubscription = {
  unsubscribe: () => void;
};

export const subscribeToShiftUpdates = (employeeId: string, onUpdate: () => void): ShiftSubscription => {
  if (!supabase || !employeeId) {
    return { unsubscribe: () => {} };
  }

  const channel = supabase.channel(`shift_assignments:${employeeId}`);
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'shift_assignments',
      filter: `employeeId=eq.${employeeId}`,
    },
    () => onUpdate()
  );

  channel.subscribe();

  return {
    unsubscribe: () => channel.unsubscribe(),
  };
};

export const getShiftById = async (shiftId: string): Promise<Shift | undefined> => {
  if (!supabase) {
    return fallbackShifts.find((shift) => shift.id === shiftId) ?? fallbackShifts[0];
  }

  try {
    const { data, error } = await supabase.from('shifts').select('*').eq('id', shiftId).maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return mapShiftRecord(data);
    }
  } catch (error) {
    console.warn('Shift detail fetch failed', error);
  }

  return fallbackShifts.find((shift) => shift.id === shiftId) ?? fallbackShifts[0];
};
