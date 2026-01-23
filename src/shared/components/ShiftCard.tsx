import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Shift } from '@features/shifts/shiftsService';
import { PrimaryButton } from '@shared/components/PrimaryButton';
const statusColors: Record<string, string> = {
  scheduled: '#2563eb',
  'in-progress': '#059669',
  completed: '#6b7280',
  blocked: '#dc2626',
};

const formatTime = (iso: string) => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatDate = (iso: string) => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }
  return parsed.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatDateTime = (iso: string) => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return '—';
  }
  return parsed.toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return '—';
  }
  const minutes = Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  const hoursText = hours ? `${hours}h ` : '';
  const minutesText = remainder ? `${remainder}m` : '';
  return `${hoursText}${minutesText}`.trim() || '—';
};

type Props = {
  shift: Shift;
  onPress?: () => void;
  onConfirm?: () => void;
  confirmLoading?: boolean;
};

export const ShiftCard = ({ shift, onPress, onConfirm, confirmLoading }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>{shift.title}</Text>
          <Text style={styles.date}>{formatDate(shift.start)}</Text>
        </View>
        <View style={styles.badgeWrapper}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[shift.status] ?? '#eff6ff' }]}>
            <Text style={[styles.statusText, { color: statusColors[shift.status] ?? '#1d4ed8' }]}>
              {shift.status.replace(/\b\w/g, (char) => char.toUpperCase())}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.time}>{formatTime(shift.start)} – {formatTime(shift.end)}</Text>
        <Text style={styles.duration}>{formatDuration(shift.start, shift.end)}</Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Start</Text>
          <Text style={styles.detailValue}>{formatDateTime(shift.start)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>End</Text>
          <Text style={styles.detailValue}>{formatDateTime(shift.end)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{formatDuration(shift.start, shift.end)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{shift.location}</Text>
        </View>
      </View>

      {shift.description ? <Text style={styles.description}>{shift.description}</Text> : null}

      {shift.assignmentId && (
        <View style={styles.confirmSection}>
          {shift.confirmationStatus?.toLowerCase() === 'confirmed' ? (
            <Text style={styles.confirmedText}>Confirmed</Text>
          ) : (
            onConfirm && (
              <PrimaryButton
                title="Confirm shift"
                onPress={onConfirm}
                loading={confirmLoading}
                style={styles.confirmButton}
              />
            )
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  titleGroup: {
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  badgeWrapper: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 110,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  duration: {
    color: '#475569',
    fontSize: 13,
  },
  detailsGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    marginTop: 4,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    color: '#475569',
  },
  confirmationMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  confirmSection: {
    marginTop: 12,
  },
  confirmButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
  },
  confirmedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
});
