import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { getShifts } from '@features/shifts/shiftsService';
import { useTheme } from '@shared/themeContext';
import { useAuth } from '@hooks/useSupabaseAuth';
import { languageDefinitions, useLanguage } from '@shared/context/LanguageContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDay = (iso: string) => {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTimeRange = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—';
  const startLabel = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const endLabel = end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${startLabel} · ${endLabel}`;
};

const profileName = (user: ReturnType<typeof useAuth>['user'] | null) => {
  if (!user) return 'Guest';
  const metadataName = user.user_metadata?.full_name;
  if (typeof metadataName === 'string' && metadataName.trim()) {
    return metadataName;
  }
  return user.email?.split('@')[0] ?? 'Employee';
};

const shiftStatus = (metadata?: Record<string, unknown> | null) => {
  if (!metadata) return 'Active';
  const customStatus = metadata?.status;
  if (typeof customStatus === 'string' && customStatus.trim()) {
    return customStatus;
  }
  return 'Active';
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { mode, setMode, theme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const renderLanguageToggle = (
    <View style={[styles.languagePill, { backgroundColor: theme.surface }]}>
      {languageDefinitions.map((definition) => {
        const isActive = language === definition.code;
        return (
          <TouchableOpacity
            key={definition.code}
            onPress={() => setLanguage(definition.code)}
            style={[styles.languageOption, isActive && styles.languageOptionActive]}
          >
            <Text style={[styles.languageText, isActive && styles.languageTextActive]}>
              {definition.flag}
            </Text>
            <Text style={[styles.languageLabel, isActive && styles.languageTextActive]}>
              {definition.shortLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
  const router = useRouter();
  const userId = user?.id;
  const provider = user?.identities?.[0]?.provider ?? 'email';
  const status = shiftStatus(user?.user_metadata);
  const translatedStatus = status === 'Active' ? t('statusActive') : status;
  const { data: profileShifts } = useQuery({
    queryKey: ['profile', 'shifts', userId],
    queryFn: () => getShifts(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
  const now = useMemo(() => new Date(), []);
  const upcomingShifts = useMemo(() => {
    if (!profileShifts) return [];
    return profileShifts.filter((shift) => {
      const startDate = new Date(shift.start);
      return !Number.isNaN(startDate.getTime()) && startDate > now;
    });
  }, [profileShifts, now]);
  const upcomingHoursMs = useMemo(
    () =>
      upcomingShifts.reduce((total, shift) => {
        const startDate = new Date(shift.start);
        const endDate = new Date(shift.end);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
          return total;
        }
        return total + Math.max(0, endDate.getTime() - startDate.getTime());
      }, 0),
    [upcomingShifts]
  );
  const upcomingHoursLabel = `${Math.round((upcomingHoursMs / 3_600_000) * 10) / 10}h`;
  const nextShift = upcomingShifts[0];
  const nextShiftLabel = nextShift
    ? `${new Date(nextShift.start).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      })} · ${new Date(nextShift.start).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })}`
    : t('noUpcomingShifts');
  const nextShiftLocation = nextShift?.objectName ?? nextShift?.location;
  const handleSignOut = () => {
    signOut();
  };
  const handleViewSchedule = () => {
    router.push('/my-shifts');
  };
  const upcomingPreview = upcomingShifts.slice(0, 3);
  const quickActions = [
    {
      id: 'clock-in',
      label: t('quickActionClockIn'),
      subtitle: t('quickActionClockInSub'),
    },
    {
      id: 'hours',
      label: t('quickActionHours'),
      subtitle: t('quickActionHoursSub'),
    },
    {
      id: 'support',
      label: t('quickActionSupport'),
      subtitle: t('quickActionSupportSub'),
    },
  ];
  const heroGradientColors =
    mode === 'dark'
      ? ['#111827', '#0f172a', theme.primary]
      : [theme.primary, '#7c3aed', '#2563eb'];

  const safeAreaStyle = { paddingTop: 12 + insets.top };
  const contentContainerStyle = [styles.content, { paddingBottom: 40 + insets.bottom }];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background, ...safeAreaStyle }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={contentContainerStyle}
      >
        <LinearGradient colors={heroGradientColors} style={styles.heroGradient}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroTitle}>{t('profileGreeting', { name: profileName(user) })}</Text>
              <Text style={styles.heroSubtitle}>{t('profileSettingsSync')}</Text>
            </View>
            <View style={[styles.avatar, { shadowColor: '#1f2937', shadowOpacity: 0.4 }]}>
              <Text style={styles.avatarInitial}>{profileName(user).charAt(0)}</Text>
            </View>
          </View>
          <View style={styles.heroTagRow}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagLabel}>{t('memberSince', { date: formatDate(user?.created_at) })}</Text>
            </View>
            <View style={[styles.heroTag, styles.heroTagActive]}>
              <Text style={[styles.heroTagLabel, styles.heroTagActiveText]}>{translatedStatus}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>{t('memberSinceLabel')}</Text>
            <Text style={styles.memberBadgeDetail}>{formatDate(user?.created_at)}</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.languageWrapper}>{renderLanguageToggle}</View>

        <View style={styles.infoGrid}>
          {[
            { label: t('providerLabel'), value: provider.toUpperCase() },
            {
              label: t('emailVerifiedLabel'),
              value: user?.email_confirmed_at ? t('yes') : t('pending'),
            },
            { label: t('statusActive'), value: translatedStatus },
          ].map((stat) => (
            <View key={stat.label} style={[styles.infoCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.quickActions, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('quickActionsTitle')}</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { borderColor: theme.border }]}
              >
                <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>{action.label}</Text>
                <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('shiftSnapshot')}</Text>
          <View style={styles.summaryRow}>
            <View>
              <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{upcomingShifts.length}</Text>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{t('upcomingShifts')}</Text>
            </View>
            <View>
              <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{upcomingHoursLabel}</Text>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>{t('shiftHoursLabel')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewScheduleButton} onPress={handleViewSchedule}>
            <Text style={styles.viewScheduleText}>{t('viewSchedule')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('nextShift')}</Text>
          <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{nextShiftLabel}</Text>
          {nextShiftLocation ? (
            <Text style={[styles.detailSubtitle, { color: theme.textSecondary }]}>{nextShiftLocation}</Text>
          ) : null}
        </View>

        <View style={[styles.securityCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{t('security')}</Text>
          <View style={styles.securityRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{t('appearance')}</Text>
            <View style={styles.toggleRow}>
              {(['light', 'dark'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.toggleButton,
                    mode === option && styles.toggleButtonActive,
                    mode === option && { borderColor: theme.primary },
                  ]}
                  onPress={() => setMode(option)}
                >
                  <Text
                    style={[
                      styles.toggleLabel,
                      mode === option && styles.toggleLabelActive,
                      mode === option && { color: theme.primary },
                    ]}
                  >
                    {option === 'light' ? t('lightMode') : t('darkMode')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PrimaryButton title={t('signOut')} onPress={handleSignOut} style={styles.button} />
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={[styles.link, { color: theme.primary }]}>{t('switchAccount')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 40,
  },
  safeArea: {
    flex: 1,
  },
  heroGradient: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 18,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 6,
  },
  heroTagRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  heroTag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  heroTagLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#f8fafc',
  },
  heroTagActive: {
    backgroundColor: '#111827',
    borderColor: 'transparent',
  },
  heroTagActiveText: {
    color: '#f8fafc',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1f2937',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarInitial: {
    color: '#1d4ed8',
    fontWeight: '700',
    fontSize: 26,
  },
  memberBadge: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  memberBadgeText: {
    fontSize: 10,
    letterSpacing: 0.4,
    color: 'rgba(255,255,255,0.8)',
  },
  memberBadgeDetail: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  languageWrapper: {
    marginBottom: 12,
  },
  languagePill: {
    flexDirection: 'row',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 180,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  languageOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginHorizontal: 4,
    backgroundColor: 'rgba(37,99,235,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageOptionActive: {
    backgroundColor: '#2563eb',
  },
  languageText: {
    fontSize: 13,
    fontWeight: '700',
  },
  languageLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: '#94a3b8',
    marginLeft: 4,
  },
  languageTextActive: {
    color: '#fff',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  infoLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  quickActions: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  viewScheduleButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  viewScheduleText: {
    fontWeight: '600',
  },
  detailCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  securityCard: {
    borderRadius: 20,
    padding: 18,
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 20,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
  },
  toggleButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
    borderColor: '#d1d5db',
  },
  toggleButtonActive: {
    backgroundColor: '#2563eb',
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  toggleLabelActive: {
    color: '#fff',
  },
  button: {
    marginTop: 12,
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
  },
});
