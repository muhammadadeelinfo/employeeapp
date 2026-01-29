import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const readmeSummary = [
  'Employee Portal is an Expo app backed by Supabase for shift data plus shared Prisma/Next.js tooling.',
  'Copy .env.example to .env, fill SUPABASE_URL and keys, and run npm run check-db-config before starting Metro.',
  'Use npm run start / android / ios / web to preview the app, and keep the Supabase project aligned with the Next.js config.',
  'Location access is intentionally disabled in Expo dev builds unless ENABLE_LOCATION_IN_DEV=true to avoid simulator issues.',
  'Magic-link auth is planned; the README captures how the key-sharing works across mobile and web.',
];

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Employee Portal</Text>
        {readmeSummary.map((line) => (
          <View key={line} style={styles.row}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.text}>{line}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030711',
  },
  content: {
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    color: '#a5b4fc',
    marginRight: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  text: {
    flex: 1,
    color: '#e0e7ff',
    fontSize: 14,
    lineHeight: 22,
  },
});
