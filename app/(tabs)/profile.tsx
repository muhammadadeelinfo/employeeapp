import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useTheme } from '@shared/themeContext';
import { useAuth } from '@hooks/useSupabaseAuth';

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
  const provider = user?.identities?.[0]?.provider ?? 'email';
  const status = shiftStatus(user?.user_metadata);
  const handleSignOut = () => {
    signOut();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.hero, { backgroundColor: theme.surface }]}>
        <View style={styles.heroRow}>
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Hello, {profileName(user)}!</Text>
            <Text style={[styles.subHeader, { color: theme.textSecondary }]}>
              Profile settings are synced across web and Expo.
            </Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{profileName(user).charAt(0)}</Text>
          </View>
        </View>
        <View style={styles.tagRow}>
          <View style={[styles.tag, { borderColor: theme.primary }]}>
            <Text style={[styles.tagLabel, { color: theme.primary }]}>Member since {formatDate(user?.created_at)}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: theme.primary, borderColor: theme.primary }]}>
            <Text style={[styles.tagLabel, { color: '#fff' }]}>{status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: 'Provider', value: provider.toUpperCase() },
          { label: 'Email verified', value: user?.email_confirmed_at ? 'Yes' : 'Pending' },
          { label: 'Member since', value: formatDate(user?.created_at) },
        ].map((stat, index, list) => (
          <View
            key={stat.label}
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                shadowColor: theme.shadowBlue,
                borderColor: theme.border,
              },
              index !== list.length - 1 && { marginRight: 12 },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.shadowBlue,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>Security</Text>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Provider</Text>
          <Text style={[styles.detailValue, { color: theme.textSecondary }]}>{provider}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Email verified</Text>
          <Text style={[styles.detailValue, { color: theme.textSecondary }]}>
            {user?.email_confirmed_at ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.shadowBlue,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>Appearance</Text>
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
                {option === 'light' ? 'Light mode' : 'Dark mode'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PrimaryButton title="Sign out" onPress={handleSignOut} style={styles.button} />
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={[styles.link, { color: theme.primary }]}>Need to switch accounts? Log in again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#eef2ff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  tag: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
  },
  subHeader: {
    marginTop: 4,
    fontSize: 14,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  detailLabel: {
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  detailBlock: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniLabel: {
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  miniValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  button: {
    marginTop: 18,
  },
  link: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#eef2ff',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  toggleLabelActive: {
    color: '#2563eb',
  },
});
