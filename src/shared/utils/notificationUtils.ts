export type NotificationCategory =
  | 'shift-published'
  | 'shift-removed'
  | 'shift-schedule'
  | 'admin'
  | 'general';

export const notificationCategoryLabelKeys: Record<
  NotificationCategory,
  | 'notificationCategoryShiftPublished'
  | 'notificationCategoryShiftRemoved'
  | 'notificationCategoryScheduleChanged'
  | 'notificationCategoryAdminMessage'
  | 'notificationCategoryGeneral'
> = {
  'shift-published': 'notificationCategoryShiftPublished',
  'shift-removed': 'notificationCategoryShiftRemoved',
  'shift-schedule': 'notificationCategoryScheduleChanged',
  admin: 'notificationCategoryAdminMessage',
  general: 'notificationCategoryGeneral',
};

export type NotificationRecord = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  read: boolean;
  category: NotificationCategory;
  metadata?: Record<string, unknown>;
  targetPath?: string;
};

const normalizeString = (value?: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const decodeRepeatedly = (value: string, maxIterations = 3): string => {
  let current = value;
  for (let i = 0; i < maxIterations; i += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
};

const unwrapExpoDevClientUrl = (value: string): string => {
  if (!/^[a-z][a-z0-9+\-.]*:\/\//i.test(value)) return value;

  try {
    const parsed = new URL(value);
    const wrappedUrl = parsed.searchParams.get('url');
    const isDevClientWrapper =
      parsed.hostname === 'expo-development-client' ||
      parsed.pathname.includes('expo-development-client');

    if (isDevClientWrapper && wrappedUrl) {
      return decodeRepeatedly(wrappedUrl);
    }
  } catch {
    // keep original candidate when URL parsing fails
  }

  return value;
};

const normalizeRoutePath = (value: string): string => {
  let candidate = decodeRepeatedly(value.trim());
  candidate = unwrapExpoDevClientUrl(candidate);

  // Expo links can look like exp://host:port/--/path
  const expoPathMarker = '/--/';
  const markerIndex = candidate.indexOf(expoPathMarker);
  if (markerIndex >= 0) {
    candidate = candidate.slice(markerIndex + expoPathMarker.length);
  }

  // Plain URLs should be reduced to path/query/hash so router.push can consume them.
  if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(candidate)) {
    try {
      const parsed = new URL(candidate);
      candidate = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      // keep original candidate when URL parsing fails
    }
  }

  if (!candidate.startsWith('/')) {
    candidate = `/${candidate}`;
  }

  // Route groups like /(tabs)/account are internal and should not appear in public paths.
  candidate = candidate.replace(/\/\([^/]+?\)(?=\/|$)/g, '');

  // Collapse duplicate slashes and remove trailing slash (except root).
  candidate = candidate.replace(/\/{2,}/g, '/');
  if (candidate.length > 1) {
    candidate = candidate.replace(/\/+$/g, '');
  }

  return candidate;
};

export const determineNotificationCategory = (
  title: string,
  detail: string
): NotificationCategory => {
  const normalized = `${title} ${detail}`.toLowerCase();
  if (
    normalized.includes('published') ||
    normalized.includes('assigned') ||
    normalized.includes('new shift') ||
    normalized.includes('veröffentlicht') ||
    normalized.includes('zugewiesen') ||
    normalized.includes('neue schicht')
  ) {
    return 'shift-published';
  }
  if (
    normalized.includes('removed') ||
    normalized.includes('canceled') ||
    normalized.includes('cancelled') ||
    normalized.includes('entfernt') ||
    normalized.includes('abgesagt') ||
    normalized.includes('storniert')
  ) {
    return 'shift-removed';
  }
  if (
    normalized.includes('schedule') ||
    normalized.includes('updated') ||
    normalized.includes('changed') ||
    normalized.includes('plan') ||
    normalized.includes('aktualisiert') ||
    normalized.includes('geändert')
  ) {
    return 'shift-schedule';
  }
  if (
    normalized.includes('admin') ||
    normalized.includes('policy') ||
    normalized.includes('message') ||
    normalized.includes('announcement') ||
    normalized.includes('richtlinie') ||
    normalized.includes('nachricht') ||
    normalized.includes('ankündigung')
  ) {
    return 'admin';
  }
  return 'general';
};

export const resolveTargetPath = (metadata?: Record<string, unknown>) => {
  if (!metadata) return undefined;
  const directTarget = normalizeString(metadata.target ?? metadata.url ?? metadata.deepLink);
  if (directTarget) return normalizeRoutePath(directTarget);
  const shiftId = normalizeString(
    metadata.shiftId ?? metadata.shift_id ?? metadata.assignmentId ?? metadata.assignment_id
  );
  if (shiftId) {
    return `/shift-details/${shiftId}`;
  }
  return undefined;
};

export const parseIsoDate = (value?: unknown): string => {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number') return new Date(value).toISOString();
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
};

export const normalizeNotificationRow = (
  row: Record<string, unknown>,
  defaults: { title: string; detail: string }
): NotificationRecord | null => {
  const rawId = row.id ?? row.notificationId ?? row.notification_id;
  if (rawId === undefined || rawId === null) return null;
  const titleCandidate =
    typeof row.title === 'string' && row.title.trim()
      ? row.title.trim()
      : typeof row.message === 'string' && row.message.trim()
      ? row.message.trim()
      : undefined;
  const detailCandidate =
    typeof row.detail === 'string' && row.detail.trim()
      ? row.detail.trim()
      : typeof row.body === 'string' && row.body.trim()
      ? row.body.trim()
      : typeof row.description === 'string' && row.description.trim()
      ? row.description.trim()
      : undefined;
  const normalizedTitle = titleCandidate ?? defaults.title;
  const normalizedDetail = detailCandidate ?? defaults.detail;
  const createdAt = parseIsoDate(
    row.created_at ?? row.createdAt ?? row.sent_at ?? row.timestamp ?? row.time
  );
  const read = Boolean(
    row.is_read ?? row.read ?? row.viewed ?? row.dismissed ?? row.status === 'read'
  );
  const category = determineNotificationCategory(normalizedTitle, normalizedDetail);
  const metadata = (row.metadata ?? row.meta ?? row.data ?? row.payload ?? row.context) as
    | Record<string, unknown>
    | undefined;
  const targetPath = resolveTargetPath(metadata);
  return {
    id: String(rawId),
    title: normalizedTitle,
    detail: normalizedDetail,
    createdAt,
    read,
    category,
    metadata,
    targetPath,
  };
};

const areSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export type NotificationSectionKey = 'today' | 'yesterday' | 'earlier';

export const groupNotificationsByRecency = (
  notifications: NotificationRecord[],
  sectionLabels: Record<NotificationSectionKey, string>,
  now = new Date()
): {
  key: NotificationSectionKey;
  title: string;
  items: NotificationRecord[];
}[] => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const buckets: Record<NotificationSectionKey, NotificationRecord[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  notifications.forEach((item) => {
    const created = new Date(item.createdAt);
    if (areSameDay(created, now)) {
      buckets.today.push(item);
    } else if (areSameDay(created, yesterday)) {
      buckets.yesterday.push(item);
    } else {
      buckets.earlier.push(item);
    }
  });

  return (['today', 'yesterday', 'earlier'] as NotificationSectionKey[])
    .map((key) => ({
      key,
      title: sectionLabels[key],
      items: buckets[key],
    }))
    .filter((section) => section.items.length > 0);
};
