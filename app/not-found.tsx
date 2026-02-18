import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@shared/context/LanguageContext';

export default function NotFoundScreen() {
  const { t } = useLanguage();
  const readmeSummary = [
    t('notFoundSummaryOne'),
    t('notFoundSummaryTwo'),
    t('notFoundSummaryThree'),
    t('notFoundSummaryFour'),
    t('notFoundSummaryFive'),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{t('notFoundHeading')}</Text>
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
