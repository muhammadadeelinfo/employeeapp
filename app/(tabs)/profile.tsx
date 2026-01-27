import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '@shared/components/PrimaryButton';
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
  const provider = user?.identities?.[0]?.provider ?? 'email';
  const status = shiftStatus(user?.user_metadata);
  const translatedStatus = status === 'Active' ? t('statusActive') : status;
  const handleSignOut = () => {
    signOut();
  };
  const safeAreaStyle = { paddingTop: 12 + insets.top };
  const contentContainerStyle = [styles.content, { paddingBottom: 40 + insets.bottom }];
  const appearanceOptions = [
    { key: 'light' as const, label: t('lightMode') },
    { key: 'dark' as const, label: t('darkMode') },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background, ...safeAreaStyle }]}> 
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={contentContainerStyle}
      >
        <View style={[styles.profileHeadline, { backgroundColor: theme.surface }]}> 
          <View>
            <Text style={[styles.profileGreeting, { color: theme.textPrimary }]}> 
              {t('profileGreeting', { name: profileName(user) })}
            </Text>
            <Text style={[styles.profileSubtext, { color: theme.textSecondary }]}>
              {t('profileSettingsSync')}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: theme.primary }]}> 
            <Text style={styles.statusBadgeText}>{translatedStatus}</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={[styles.badgePill, { backgroundColor: theme.surface, marginRight: 12 }]}>
            <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>{t('memberSinceLabel')}</Text>
            <Text style={[styles.badgeValue, { color: theme.textPrimary }]}>{formatDate(user?.created_at)}</Text>
          </View>
          <View style={[styles.badgePill, { backgroundColor: theme.surface, marginRight: 0 }]}>
            <Text style={[styles.badgeLabel, { color: theme.textSecondary }]}>{t('providerLabel')}</Text>
            <Text style={[styles.badgeValue, { color: theme.textPrimary }]}>{provider.toUpperCase()}</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}> 
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>{t('accountSnapshot')}</Text>
          <View style={styles.infoGrid}>
            {[
              { label: t('emailVerifiedLabel'), value: user?.email_confirmed_at ? t('yes') : t('pending') },
              { label: t('statusActive'), value: translatedStatus },
            ].map((stat) => (
              <View key={stat.label} style={[styles.infoCard, { backgroundColor: theme.surface }]}> 
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
                <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.surface }]}> 
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>{t('security')}</Text>
          <View style={styles.preferenceGroup}>
            <Text style={[styles.preferenceLabel, { color: theme.textSecondary }]}>{t('preferencesTitle')}</Text>
            <View style={styles.smallToggleRow}>
              {appearanceOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => setMode(option.key)}
                  style={[
                    styles.smallToggleOption,
                    mode === option.key && styles.smallToggleOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.smallToggleLabel,
                      mode === option.key && styles.smallToggleLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.preferenceGroup}>
            <Text style={[styles.preferenceLabel, { color: theme.textSecondary }]}>{t('languageLabel')}</Text>
            <View style={styles.languageToggleList}>
              {languageDefinitions.map((definition) => {
                const isActive = language === definition.code;
                return (
                  <TouchableOpacity
                    key={definition.code}
                    onPress={() => setLanguage(definition.code)}
                    style={[
                      styles.languageToggleItem,
                      isActive && styles.languageToggleItemActive,
                    ]}
                  >
                    <Text style={styles.languageFlag}>{definition.flag}</Text>
                    <Text
                      style={[
                        styles.languageShortLabel,
                        isActive && styles.languageShortLabelActive,
                      ]}
                    >
                      {definition.shortLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
  profileHeadline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  profileGreeting: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#fff',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badgePill: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  badgeLabel: {
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'flex-start',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  infoLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  preferenceGroup: {
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  smallToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 4,
  },
  smallToggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallToggleOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  smallToggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  smallToggleLabelActive: {
    color: '#111827',
  },
  languageToggleList: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    padding: 4,
  },
  languageToggleItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageToggleItemActive: {
    backgroundColor: '#fff',
    borderColor: '#cbd5f5',
  },
  languageFlag: {
    fontSize: 14,
    marginRight: 4,
  },
  languageShortLabel: {
    fontSize: 11,
    letterSpacing: 0.3,
    color: '#475569',
  },
  languageShortLabelActive: {
    color: '#111827',
    fontWeight: '700',
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
  },
});
