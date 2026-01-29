import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeProvider } from '@shared/themeContext';
import { useLanguage } from '@shared/context/LanguageContext';

const iconConfig: Record<string, { labelKey: string; active: string; inactive: string }> = {
  'job-offers': {
    labelKey: 'guestJobTab',
    active: 'briefcase',
    inactive: 'briefcase-outline',
  },
  perks: {
    labelKey: 'guestPerksTab',
    active: 'sparkles',
    inactive: 'sparkles-outline',
  },
  community: {
    labelKey: 'guestCommunityTab',
    active: 'people-sharp',
    inactive: 'people-outline',
  },
};

export default function GuestTabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <ThemeProvider>
      <Tabs
        screenOptions={({ route }) => {
          const icon = iconConfig[route.name] ?? {
            labelKey: route.name,
            active: 'square',
            inactive: 'square-outline',
          };

          return {
            headerShown: false,
            tabBarLabel: t(icon.labelKey),
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#e5e7eb',
              paddingVertical: 6,
              paddingBottom: Math.max(12, insets.bottom),
            },
            tabBarItemStyle: {
              justifyContent: 'center',
              paddingTop: 2,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={(focused ? icon.active : icon.inactive) as any}
                color={color}
                size={size}
              />
            ),
          };
        }}
      >
        <Tabs.Screen name="job-offers" />
        <Tabs.Screen name="perks" />
        <Tabs.Screen name="community" />
      </Tabs>
    </ThemeProvider>
  );
}
