import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useAuth } from '@hooks/useSupabaseAuth';
import { Link } from 'expo-router';

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
  const provider = user?.identities?.[0]?.provider ?? 'email';
  const status = shiftStatus(user?.user_metadata);

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{provider.toUpperCase()} ACCESS</Text>
          <Text style={styles.badgeDate}>Member since {formatDate(user?.created_at)}</Text>
        </View>
        <Text style={styles.header}>Hello, {profileName(user)}!</Text>
        <Text style={styles.subHeader}>Profile settings are synced across web and Expo.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Contact</Text>
        <Text style={styles.detailLabel}>Email</Text>
        <Text style={styles.detailValue}>{user?.email ?? 'Not signed in'}</Text>
        <View style={styles.divider} />
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.miniLabel}>Role</Text>
            <Text style={styles.miniValue}>{user ? 'Employee' : 'Guest'}</Text>
          </View>
          <View>
            <Text style={styles.miniLabel}>Status</Text>
            <Text style={styles.miniValue}>{status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Security</Text>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Provider</Text>
          <Text style={styles.detailValue}>{provider}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Email verified</Text>
          <Text style={styles.detailValue}>{user?.email_confirmed_at ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      <PrimaryButton title="Sign out" onPress={signOut} style={styles.button} />
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.link}>Need to switch accounts? Log in again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0b0f1c',
  },
  headerBlock: {
    marginBottom: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1b2a50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#7dd3fc',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badgeDate: {
    color: '#94a3b8',
    fontSize: 11,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  subHeader: {
    marginTop: 4,
    fontSize: 14,
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#14192d',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
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
    color: '#f8fafc',
    marginTop: 2,
  },
  detailBlock: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
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
    color: '#fff',
    marginTop: 4,
  },
  button: {
    marginTop: 18,
  },
  link: {
    marginTop: 18,
    color: '#38bdf8',
    textAlign: 'center',
    fontSize: 14,
  },
});
