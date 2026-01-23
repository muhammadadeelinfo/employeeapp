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

const normalizeTimestampPair = (date?: unknown, time?: unknown, fallback?: string): string | undefined => {
  const isoDate = parseIso(date);
  const isoTime = parseIso(time);
  if (isoDate && isoTime) {
    const combined = new Date(`${isoDate.split('T')[0]}T${isoTime.split('T')[1]}`);
    if (!Number.isNaN(combined.getTime())) return combined.toISOString();
  }
  return isoDate ?? isoTime ?? fallback;
};

const mapShiftRecord = (raw: Record<string, unknown>): Shift => {
  const start = normalizeTimestampPair(
    raw.shiftStartingDate ?? raw.start ?? raw.start_time ?? raw.start_at,
    raw.shiftStartingTime ?? raw.startTime ?? raw.start_time,
    fallbackShifts[0].start
  )!;
  const end = normalizeTimestampPair(
    raw.shiftEndingDate ?? raw.end ?? raw.end_time ?? raw.end_at,
    raw.shiftEndingTime ?? raw.endTime ?? raw.end_time,
    fallbackShifts[0].end
  )!;
  const statusValue =
    (typeof raw.status === 'string' && raw.status) ||
    (typeof raw.shift_status === 'string' && raw.shift_status) ||
    'scheduled';
  return {
    id:
      (typeof raw.id === 'string' && raw.id) ||
      (typeof raw.shift_id === 'string' && raw.shift_id) ||
      (typeof raw.uuid === 'string' && raw.uuid) ||
      'unknown',
    title:
      (typeof raw.title === 'string' && raw.title) ||
      (typeof raw.name === 'string' && raw.name) ||
      (typeof raw.shift_name === 'string' && raw.shift_name) ||
      'Shift',
    location:
      (typeof raw.location === 'string' && raw.location) ||
      (typeof raw.venue === 'string' && raw.venue) ||
      (typeof raw.place === 'string' && raw.place) ||
      'TBD',
    start,
    end,
    status: normalizeStatus(statusValue),
    description:
      (typeof raw.description === 'string' && raw.description) ||
      (typeof raw.details === 'string' && raw.details) ||
      undefined,
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

const employeeColumns = ['employee_id', 'user_id', 'profile_id', 'owner_id'];

type ShiftSource = {
  table: string;
  select: string[];
};

const shiftSources: ShiftSource[] = [
  {
    table: 'shift_assignments',
    select: [
      'id',
      'title',
      'address as location',
      'shiftStartingDate',
      'shiftStartingTime',
      'shiftEndingDate',
      'shiftEndingTime',
      'status',
      'shiftDescription as description',
      ...employeeColumns,
    ],
  },
  {
    table: 'shifts',
    select: ['id', 'title', 'location', 'start', 'end', 'status', 'description', ...employeeColumns],
  },
];

const isMissingColumnError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PostgrestError).code === '42703'
  );
};

const tryFetchFromSource = async (source: ShiftSource, employeeId?: string): Promise<Record<string, unknown>[]> => {
  const selectString = Array.from(new Set(source.select)).join(',');
  if (!employeeId) {
    const { data, error } = await supabase.from(source.table).select(selectString);
    if (error) {
      throw error;
    }
    return data ?? [];
  }

  for (const column of employeeColumns) {
    try {
      const { data, error } = await supabase.from(source.table).select(selectString).eq(column, employeeId);
      if (error) {
        throw error;
      }
      return data ?? [];
    } catch (error) {
      if (isMissingColumnError(error)) {
        continue;
      }
      throw error;
    }
  }

  const { data, error } = await supabase.from(source.table).select(selectString);
  if (error) {
    throw error;
  }
  return data ?? [];
};

const isTableMissingError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as PostgrestError).code === '42P01'
  );
};

const fetchShiftsFromSupabase = async (employeeId?: string): Promise<Record<string, unknown>[] | undefined> => {
  for (const source of shiftSources) {
    try {
      const data = await tryFetchFromSource(source, employeeId);
      return data;
    } catch (error) {
      if (isMissingColumnError(error) || isTableMissingError(error)) {
        continue;
      }
      throw error;
    }
  }

  return undefined;
};

export const getShifts = async (employeeId?: string): Promise<Shift[]> => {
  if (!supabase) {
    throw new Error('Supabase client not configured');
  }

  const data = await fetchShiftsFromSupabase(employeeId);
  if (data === undefined) {
    throw new Error('No shift source available');
  }

  return mapShiftArray(data);
};

const matchesEmployeePayload = (record: Record<string, unknown>, employeeId: string) =>
  employeeColumns.some((column) => record[column] === employeeId);

type ShiftSubscription = {
  unsubscribe: () => void;
};

export const subscribeToShiftUpdates = (employeeId: string, onUpdate: () => void): ShiftSubscription => {
  if (!supabase || !employeeId) {
    return { unsubscribe: () => {} };
  }

  const channels: RealtimeChannel[] = shiftSources.map((source) => {
    const channel = supabase.channel(`shift-stream:${source.table}:${employeeId}`);

    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: source.table },
      (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
        const record =
          (payload.new && Object.keys(payload.new).length ? payload.new : undefined) ??
          (payload.old && Object.keys(payload.old).length ? payload.old : undefined);
        if (!record) {
          onUpdate();
          return;
        }
        if (matchesEmployeePayload(record, employeeId)) {
          onUpdate();
        }
      }
    );

    channel.subscribe();
    return channel;
  });

  return {
    unsubscribe: () => {
      channels.forEach((channel) => channel.unsubscribe());
    },
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
