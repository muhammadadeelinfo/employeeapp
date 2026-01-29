import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useLanguage } from '@shared/context/LanguageContext';

const jobOpportunities = [
  {
    id: 'launch-lead',
    title: 'Launch Experience Lead',
    location: 'Downtown hub • Onsite',
    summary: 'Curate memorable shifts for our high-touch retail pop-up with a team of 12 specialists.',
    metric: 'Flexible day shifts · 32-40 hrs/week',
    accent: '#dbeafe',
  },
  {
    id: 'community-coordinator',
    title: 'Community Coordinator',
    location: 'Hybrid · Remote 2 days/week',
    summary: 'Bridge operations and people teams to keep crew briefings, perks, and socials in sync.',
    metric: 'Monday–Friday · Hybrid setup',
    accent: '#eeedef',
  },
  {
    id: 'night-safety',
    title: 'Night Safety Ambassador',
    location: 'Northern Campus • Evenings',
    summary: 'Own the night shift floor, double-check guest lists, and keep everyone feeling supported.',
    metric: 'Weekends + select nights',
    accent: '#fef3c7',
  },
];

export default function GuestJobOffers() {
  const { t } = useLanguage();

  const handleAction = (title: string) => {
    Alert.alert(t('guestJobActionTitle', { jobTitle: title }), t('guestJobActionBody'));
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t('guestHeroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('guestHeroSubtitle')}</Text>
        </View>
        <Text style={styles.sectionLabel}>{t('guestJobSectionTitle')}</Text>
        {jobOpportunities.map((job) => (
          <View key={job.id} style={[styles.card, { borderColor: job.accent }]}> 
            <View>
              <Text style={styles.cardTitle}>{job.title}</Text>
              <Text style={styles.cardLocation}>{job.location}</Text>
              <Text style={styles.cardSummary}>{job.summary}</Text>
              <Text style={styles.cardMetric}>{job.metric}</Text>
            </View>
            <PrimaryButton
              title={t('guestJobActionButton')}
              onPress={() => handleAction(job.title)}
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 10,
  },
  cardSummary: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
  cardMetric: {
    fontSize: 13,
    color: '#2563eb',
    marginBottom: 6,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 12,
  },
});
