import { useEffect, useMemo, useRef } from 'react';
import { supabase } from '@lib/supabaseClient';
import { useAuth } from '@hooks/useSupabaseAuth';
import { useLanguage } from '@shared/context/LanguageContext';
import { getShiftById, type Shift } from '@features/shifts/shiftsService';
import { type ShiftNotificationI18nCopy } from '@shared/utils/shiftNotificationI18n';
import { buildShiftNotificationInsertPayload } from '@shared/utils/shiftNotificationPayload';
import { persistNotificationRow } from '@shared/utils/notificationPersistence';
import {
  SHIFT_END_KEYS,
  SHIFT_LOCATION_KEYS,
  SHIFT_START_KEYS,
  buildEventKey,
  buildShiftFilterValue,
  getShiftId,
  readRowValue,
  shouldNotifyScheduleUpdate,
} from '@shared/utils/shiftNotificationUtils';

type PostgresRealtimePayload = {
  eventType?: 'INSERT' | 'UPDATE' | 'DELETE' | string;
  commit_timestamp?: string;
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

const formatShiftWindow = (shift?: Shift) => {
  if (!shift?.start) return undefined;
  const startDate = new Date(shift.start);
  if (Number.isNaN(startDate.getTime())) return undefined;
  const dateLabel = startDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  const startLabel = startDate.toLocaleTimeString(undefined, timeOptions);
  let range = startLabel;
  if (shift.end) {
    const endDate = new Date(shift.end);
    if (!Number.isNaN(endDate.getTime())) {
      const endLabel = endDate.toLocaleTimeString(undefined, timeOptions);
      range = `${startLabel} – ${endLabel}`;
    }
  }
  return `${dateLabel} · ${range}`;
};

const buildShiftDetail = (
  shift: Shift | undefined,
  fallbackRow: Record<string, unknown> | undefined,
  fallbackDetail: string
) => {
  const location = shift?.objectName ?? shift?.location ?? readRowValue(fallbackRow, SHIFT_LOCATION_KEYS);
  const windowLabel = formatShiftWindow(shift);
  const detailParts: string[] = [];
  if (windowLabel) {
    detailParts.push(windowLabel);
  }
  if (location) {
    detailParts.push(location);
  }
  if (detailParts.length) {
    return detailParts.join(' · ');
  }
  const fallbackParts = [];
  const start = readRowValue(fallbackRow, SHIFT_START_KEYS);
  const end = readRowValue(fallbackRow, SHIFT_END_KEYS);
  if (start || end) {
    fallbackParts.push([start, end].filter(Boolean).join(' – '));
  }
  if (location) {
    fallbackParts.push(location);
  }
  return fallbackParts.filter(Boolean).join(' · ') || fallbackDetail;
};

const insertNotificationRow = async (
  employeeId: string,
  title: string,
  detail: string,
  metadata?: Record<string, unknown>
) => {
  if (!supabase) return;
  try {
    await persistNotificationRow(supabase, employeeId, {
      title,
      detail,
      metadata,
    });
  } catch (error) {
    console.warn('Failed to create shift notification', error);
  }
};

export const useShiftNotifications = (shiftIds: string[]) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const employeeId = user?.id;
  const shiftFilterValue = useMemo(() => buildShiftFilterValue(shiftIds), [shiftIds]);
  const notificationCopy = useMemo<ShiftNotificationI18nCopy>(
    () => ({
      shiftPublished: t('notificationCategoryShiftPublished'),
      shiftRemoved: t('notificationCategoryShiftRemoved'),
      shiftScheduleChanged: t('notificationCategoryScheduleChanged'),
      recentShiftUpdate: t('notificationRecentShiftUpdate'),
    }),
    [t]
  );
  const assignmentCache = useRef(new Map<string, string>());
  const shiftCache = useRef(new Map<string, string>());

  useEffect(() => {
    if (!employeeId) {
      assignmentCache.current.clear();
      shiftCache.current.clear();
    }
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId || !supabase) {
      return;
    }

    const handleAssignmentEvent = async (payload: PostgresRealtimePayload) => {
      const shiftId =
        getShiftId(payload.new) ?? getShiftId(payload.old) ?? getShiftId({ shiftId: payload.new?.shiftId });
      if (!shiftId) {
        return;
      }
      const eventKey = buildEventKey(shiftId, payload);
      if (assignmentCache.current.get(shiftId) === eventKey) {
        return;
      }
      assignmentCache.current.set(shiftId, eventKey);

      if (!payload.eventType) {
        return;
      }
      const normalizedEvent = payload.eventType.toUpperCase();
      if (normalizedEvent === 'UPDATE') {
        return;
      }

      const detail = buildShiftDetail(
        await getShiftById(shiftId),
        payload.new ?? payload.old,
        notificationCopy.recentShiftUpdate
      );
      const insertPayload = buildShiftNotificationInsertPayload(
        normalizedEvent,
        shiftId,
        detail,
        notificationCopy
      );
      await insertNotificationRow(
        employeeId,
        insertPayload.title,
        insertPayload.detail,
        insertPayload.metadata
      );
    };

    const handleShiftChangeEvent = async (payload: PostgresRealtimePayload) => {
      if (!payload.eventType) {
        return;
      }

      if (!shouldNotifyScheduleUpdate(payload)) {
        return;
      }

      const shiftId = (payload.new?.id ?? payload.old?.id ?? payload.new?.shiftId ?? payload.old?.shiftId) as
        | string
        | undefined;
      if (!shiftId) {
        return;
      }

      const eventKey = buildEventKey(shiftId, payload);
      if (shiftCache.current.get(shiftId) === eventKey) {
        return;
      }
      shiftCache.current.set(shiftId, eventKey);

      const detail = buildShiftDetail(
        await getShiftById(shiftId),
        payload.new ?? payload.old,
        notificationCopy.recentShiftUpdate
      );
      const insertPayload = buildShiftNotificationInsertPayload(
        'UPDATE',
        shiftId,
        detail,
        notificationCopy
      );
      await insertNotificationRow(
        employeeId,
        insertPayload.title,
        insertPayload.detail,
        insertPayload.metadata
      );
    };

    const assignmentChannel = supabase.channel(`shift-assignments-notifications:${employeeId}`);
    assignmentChannel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shift_assignments',
        filter: `employeeId=eq.${employeeId}`,
      },
      (payload) => {
        void handleAssignmentEvent(payload);
      }
    );
    void assignmentChannel.subscribe();

    let shiftChannel:
      | ReturnType<typeof supabase.channel>
      | null = null;
    if (shiftFilterValue) {
      shiftChannel = supabase.channel(`shift-details-notifications:${employeeId}`);
      shiftChannel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shifts',
          filter: `id=in.(${shiftFilterValue})`,
        },
        (payload) => {
          void handleShiftChangeEvent(payload);
        }
      );
      void shiftChannel.subscribe();
    }

    return () => {
      assignmentChannel.unsubscribe();
      shiftChannel?.unsubscribe();
    };
  }, [employeeId, notificationCopy, shiftFilterValue]);
};
