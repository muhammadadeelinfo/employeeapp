'use client';
import Constants from 'expo-constants';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const stageColorMap: Record<string, string> = {
  production: '#22c55e',
  staging: '#f97316',
};

export const TopBar = () => {
  const stage = Constants.expoConfig?.extra?.expoStage ?? 'development';
  const stageColor = stageColorMap[stage] ?? '#38bdf8';

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={[styles.bar, { paddingTop: Math.max(12, insets.top) }]}>
        <View style={styles.leftGroup}>
          <Ionicons name="briefcase-outline" size={22} color="#e2e8f0" />
          <View style={[styles.stageDot, { backgroundColor: stageColor }]} />
        </View>
        <View style={styles.rightGroup}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="search" size={18} color="#cbd5f5" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#f8fafc" />
            <View style={[styles.notificationDot, { backgroundColor: stageColor }]} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={22} color="#f8fafc" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  bar: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#030712',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.4)',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
