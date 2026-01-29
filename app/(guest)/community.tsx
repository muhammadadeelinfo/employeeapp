import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@shared/context/LanguageContext';

const stories = [
  {
    id: 'maya',
    quote:
      'The onboarding chatbots felt like a concierge. I saw open roles, previewed a shift, and booked a walkthrough without logging in.',
    author: 'Maya S.',
    role: 'Shift Lead',
  },
  {
    id: 'carlos',
    quote:
      'Guest access let me show my partner what being on the floor looks like—now they want to apply too.',
    author: 'Carlos P.',
    role: 'Community Coordinator',
  },
  {
    id: 'anya',
    quote:
      'Perks like the wellness stipend and flexible schedules were the tipping point. The preview tab spelled out every benefit.',
    author: 'Anya R.',
    role: 'Sales Specialist',
  },
];

const happenings = [
  { id: '1', title: 'Open house', detail: 'Drop in any Friday for a behind-the-scenes walk-through.' },
  { id: '2', title: 'Live Q&A', detail: 'Catch leaders on Twitch Wednesday nights to ask about schedules.' },
  { id: '3', title: 'Community board', detail: 'See how teammates celebrate wins, share playlists, and swap tips.' },
];

export default function GuestCommunity() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t('guestCommunityHeroTitle')}</Text>
          <Text style={styles.heroSubtitle}>{t('guestCommunityHeroSubtitle')}</Text>
        </View>
        <Text style={styles.sectionLabel}>{t('guestCommunityStoriesLabel')}</Text>
        {stories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <Text style={styles.storyQuote}>{`“${story.quote}”`}</Text>
            <Text style={styles.storyAuthor}>{story.author}</Text>
            <Text style={styles.storyRole}>{story.role}</Text>
          </View>
        ))}
        <Text style={styles.sectionLabel}>{t('guestCommunityUpcomingLabel')}</Text>
        {happenings.map((item) => (
          <View key={item.id} style={styles.happeningCard}>
            <Text style={styles.happeningTitle}>{item.title}</Text>
            <Text style={styles.happeningDetail}>{item.detail}</Text>
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
    marginTop: 20,
    marginBottom: 12,
  },
  storyCard: {
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
  storyQuote: {
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 22,
  },
  storyAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  storyRole: {
    fontSize: 13,
    color: '#6b7280',
  },
  happeningCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  happeningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  happeningDetail: {
    fontSize: 13,
    color: '#475569',
  },
});
