export const isMissingNotificationsTableError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const maybeError = error as { code?: unknown; message?: unknown };
  const code = typeof maybeError.code === 'string' ? maybeError.code : '';
  const message = typeof maybeError.message === 'string' ? maybeError.message : '';
  return code === 'PGRST205' || message.includes("Could not find the table 'public.notifications'");
};

export const getRelativeTimeLabel = (
  iso: string,
  labels: { justNow: string; comingSoon: string },
  nowMs = Date.now()
): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return labels.justNow;
  const diff = nowMs - date.getTime();
  const minute = 60 * 1000;
  if (Math.abs(diff) < minute) return labels.justNow;
  if (diff < 0) return labels.comingSoon;
  if (diff < minute * 60) return `${Math.round(diff / minute)}m ago`;
  if (diff < minute * 60 * 24) return `${Math.round(diff / (minute * 60))}h ago`;
  return `${Math.round(diff / (minute * 60 * 24))}d ago`;
};
