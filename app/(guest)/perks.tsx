import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useLanguage } from '@shared/context/LanguageContext';

const perks = [
  {
    id: 'wellness-stipend',
    title: 'Wellness stipend',
    description: 'Use $120/month for fitness, mindfulness, or co-working memberships.',
    badge: 'Well-being',
  },
  {
    id: 'early-pay',
    title: 'Early pay access',
    description: 'Withdraw a portion of your tipped earnings right after a shift.',
    badge: 'Cash flow',
  },
  {
    id: 'career-path',
    title: 'Career path coaching',
    description: 'Built-in coaching sessions and stretch assignments every quarter.',
    badge: 'Growth',
  },
  {
    id: 'culture-credit',
    title: 'Culture credit',
    description: 'Receive curated care packages, event tickets, and community gifts.',
    badge: 'Community',
  },
];

export default function GuestPerks() {
  const { t } = useLanguage();

  const handlePerkTap = (perkTitle: string) => {
    Alert.alert(t('guestPerksActionTitle', { perkTitle }), t('guestPerksActionBody'));
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t('guestPerksHeroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('guestPerksHeroSubtitle')}</Text>
        </View>
        <Text style={styles.sectionLabel}>{t('guestPerksSectionTitle')}</Text>
        {perks.map((perk) => (
          <View key={perk.id} style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{perk.badge}</Text>
            </View>
            <Text style={styles.cardTitle}>{perk.title}</Text>
            <Text style={styles.cardDescription}>{perk.description}</Text>
            <PrimaryButton
              title={t('guestPerksActionButton')}
              onPress={() => handlePerkTap(perk.title)}
              style={styles.button}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  hero: {
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  badge: {
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 6,
  },
});
