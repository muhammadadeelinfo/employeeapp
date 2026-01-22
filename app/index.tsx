import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';

export default function RootIndex() {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={styles.text}>Preparing your workspace…</Text>
      <Redirect href="(tabs)/my-shifts" />
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
