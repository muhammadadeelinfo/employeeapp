import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useSupabaseAuth';
import { useLanguage } from '@shared/context/LanguageContext';
import { getStartupRoute } from '@shared/utils/startupRoute';

export default function RootIndex() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(getStartupRoute(Boolean(user)));
  }, [loading, router, user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#93c5fd" />
      <Text style={styles.text}>
        {loading ? t('rootCheckingSession') : t('rootPreparingWorkspace')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  text: {
    color: '#6b7280',
  },
});
