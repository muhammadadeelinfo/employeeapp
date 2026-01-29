import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import type { Shift } from '@features/shifts/shiftsService';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useLanguage, type TranslationKey } from '@shared/context/LanguageContext';
import {
  getShiftConfirmationStatusLabel,
  normalizeShiftConfirmationStatus,
} from '@lib/shiftConfirmationStatus';
import { getShiftPhase, phaseMeta } from '@shared/utils/shiftPhase';
import { useTheme } from '@shared/themeContext';

const statusColors: Record<string, string> = {
  scheduled: '#2563eb',
  'in-progress': '#059669',
  completed: '#6b7280',
  blocked: '#dc2626',
};

const statusLabelTranslationKeys: Record<string, TranslationKey | undefined> = {
  scheduled: 'statusScheduled',
  'in-progress': 'statusInProgress',
  completed: 'statusCompleted',
  blocked: 'statusBlocked',
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

const truncateText = (value: string, maxLength = 36) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const simplifyAddress = (value: string) => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const segments = normalized
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (!segments.length) return '';
  if (segments.length <= 2) return segments.join(', ');
  return `${segments.slice(0, 2).join(', ')}…`;
};

type Props = {
  shift: Shift;
  onPress?: () => void;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  isPrimary?: boolean;
};

export const ShiftCard = ({
  shift,
  onPress,
  onConfirm,
  confirmLoading,
  isPrimary,
}: Props) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const { theme } = useTheme();
  const { t } = useLanguage();
  const statusColor = statusColors[shift.status] ?? '#1d4ed8';
  const statusTranslationKey = statusLabelTranslationKeys[shift.status];
  const statusLabel = statusTranslationKey ? t(statusTranslationKey) : shift.status;
  const locationLabel = shift.objectName ?? shift.location ?? 'TBD';
  const locationSubtext = shift.objectAddress ?? shift.location;
  const displayedAddress = locationSubtext
    ? showFullAddress
      ? locationSubtext
      : truncateText(simplifyAddress(locationSubtext), 50)
    : t('locationTbd');
  const normalizedConfirmationStatus = normalizeShiftConfirmationStatus(shift.confirmationStatus);
  const isConfirmed =
    normalizedConfirmationStatus === 'confirmed' ||
    normalizedConfirmationStatus === 'confirmed by employee';
  const confirmationLabel = getShiftConfirmationStatusLabel(normalizedConfirmationStatus);
  const shiftPhase = getShiftPhase(shift.start, shift.end);
  const phaseMetadata = phaseMeta[shiftPhase];

  const statusBackground = `${statusColor}1a`;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.borderSoft,
          shadowColor: isPrimary ? theme.primaryAccent : '#000',
        },
        pressed && styles.cardPressed,
        isPrimary && styles.primaryOutline,
      ]}
      onPress={onPress}
      android_ripple={{ color: theme.primary }}
      accessibilityRole="button"
      accessibilityState={{ selected: isPrimary }}
    >
      <View style={[styles.decoration, { backgroundColor: theme.primary }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.cardLabel, { color: theme.textPrimary }]}>{t('upcomingShiftListTitle')}</Text>
            <Text style={[styles.cardDate, { color: theme.textSecondary }]}>{formatDate(shift.start)}</Text>
            <View style={styles.phaseRow}>
              <View style={[styles.phasePill, { backgroundColor: phaseMetadata.background }]}>
                <Ionicons
                  name={phaseMetadata.icon}
                  size={14}
                  color={phaseMetadata.color}
                  style={styles.phaseIcon}
                />
                <Text style={[styles.phasePillText, { color: phaseMetadata.color }]}>
                  {phaseMetadata.label}
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusPill, { backgroundColor: statusBackground }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.sectionSpacer}>
          <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>{t('shiftWindowLabel')}</Text>
          <View style={styles.timeRow}>
            <View style={styles.timePart}>
              <Text style={[styles.timeValue, { color: theme.textPrimary }]}>{formatTime(shift.start)}</Text>
              <Text style={[styles.timeLabelSmall, { color: theme.textSecondary }]}>{t('shiftStartLabel')}</Text>
            </View>
            <View style={styles.timePart}>
              <Text style={[styles.timeValue, { color: theme.textPrimary }]}>{formatTime(shift.end)}</Text>
              <Text style={[styles.timeLabelSmall, { color: theme.textSecondary }]}>{t('shiftEndLabel')}</Text>
            </View>
            <View style={[styles.durationContainer, styles.timePartRight]}>
              <Text style={[styles.duration, { color: theme.textSecondary }]}>{formatDuration(shift.start, shift.end)}</Text>
              <Text style={[styles.timeLabelSmall, { color: theme.textSecondary }]}>· {t('shiftDuration')}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[
            styles.locationRow,
            {
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setShowFullAddress((prev) => !prev)}
          disabled={!locationSubtext}
          accessibilityRole="button"
        >
          <Ionicons name="location-outline" size={20} color={theme.info} style={styles.locationIcon} />
          <View style={styles.locationText}>
            <Text style={[styles.locationLabel, { color: theme.textPrimary }]}>{locationLabel}</Text>
            <Text
              style={[styles.locationDetails, { color: theme.textSecondary }]}
              numberOfLines={showFullAddress ? 2 : 1}
            >
              {displayedAddress}
            </Text>
          </View>
          {locationSubtext && (
            <Ionicons
              name={showFullAddress ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={18}
              color={theme.textSecondary}
            />
          )}
        </Pressable>

        <Text style={[styles.description, { color: theme.textSecondary }]}>{shift.description ?? t('beOnTime')}</Text>

        <View style={styles.confirmSection}>
          <View>
            <Text style={[styles.confirmInstruction, { color: theme.textSecondary }]}>{t('beOnTime')}</Text>
            <Text style={[styles.confirmSubLabel, { color: theme.textPrimary }]}>{t('confirmShift')}</Text>
          </View>
          {isConfirmed ? (
            <Text style={[styles.confirmedTextOption, { color: theme.success }]}>{confirmationLabel}</Text>
          ) : (
            onConfirm && (
              <PrimaryButton
                title={t('confirmShift')}
                onPress={onConfirm}
                loading={confirmLoading}
                style={styles.confirmButton}
              />
            )
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7ef',
  },
  cardPressed: {
    opacity: 0.95,
  },
  primaryOutline: {
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  decoration: {
    width: 6,
    backgroundColor: '#dbeafe',
  },
  content: {
    flex: 1,
    padding: 18,
    paddingBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDate: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 6,
  },
  phaseRow: {
    marginTop: 6,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  phasePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  phaseIcon: {
    marginRight: 6,
  },
  timeLabel: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#94a3b8',
  },
  timeLabelSmall: {
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  sectionSpacer: {
    marginTop: 12,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    alignItems: 'flex-end',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  duration: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  durationContainer: {
    alignItems: 'flex-end',
  },
  timePart: {
    flex: 1,
  },
  timePartRight: {
    alignItems: 'flex-end',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#f7f8ff',
    borderWidth: 1,
    borderColor: '#e5e7ef',
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  locationDetails: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  description: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    color: '#4b5563',
    minHeight: 30,
  },
  confirmSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingBottom: 6,
  },
  confirmInstruction: {
    textTransform: 'uppercase',
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  confirmSubLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  confirmedTextOption: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  confirmButton: {
    paddingHorizontal: 20,
    borderRadius: 18,
  },
});
