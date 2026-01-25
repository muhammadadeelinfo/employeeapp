export type ShiftConfirmationStatus =
  | 'not published'
  | 'pending'
  | 'scheduled'
  | 'assigned'
  | 'published'
  | 'confirmed'
  | 'confirmed by employee';

const canonical: ShiftConfirmationStatus[] = [
  'not published',
  'pending',
  'scheduled',
  'assigned',
  'published',
  'confirmed',
  'confirmed by employee',
];

const labels: Record<ShiftConfirmationStatus, string> = {
  'not published': 'Not published',
  pending: 'Pending',
  scheduled: 'Scheduled',
  assigned: 'Assigned',
  published: 'Published',
  confirmed: 'Confirmed',
  'confirmed by employee': 'Confirmed by employee',
};

const synonyms: Record<string, ShiftConfirmationStatus> = {
  'not published': 'not published',
  'not_published': 'not published',
  'not-published': 'not published',
  pending: 'pending',
  scheduled: 'scheduled',
  assigned: 'assigned',
  published: 'published',
  confirmed: 'confirmed',
  'confirmed by employee': 'confirmed by employee',
  'confirmed_by_employee': 'confirmed by employee',
  'confirmed-by-employee': 'confirmed by employee',
};

export const normalizeShiftConfirmationStatus = (
  value?: string
): ShiftConfirmationStatus => {
  if (!value) return 'not published';
  const normalized = value.trim().toLowerCase();
  const normalizedSpaces = normalized.replace(/[_-]+/g, ' ');
  return synonyms[normalizedSpaces] ?? synonyms[normalized] ?? 'not published';
};

export const getShiftConfirmationStatusLabel = (
  status: ShiftConfirmationStatus
): string => labels[status];
