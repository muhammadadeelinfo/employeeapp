import { useEffect, useState } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  Linking,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { AuthProvider } from '@hooks/useSupabaseAuth';
import { queryClient } from '@lib/queryClient';
import { useExpoPushToken } from '@hooks/useExpoPushToken';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { NotificationBell } from '@shared/components/NotificationBell';
import { NotificationProvider, useNotifications } from '@shared/context/NotificationContext';
import {
  LanguageProvider,
  useLanguage,
} from '@shared/context/LanguageContext';
import {
  CalendarSelectionProvider,
  useCalendarSelection,
} from '@shared/context/CalendarSelectionContext';
import { ThemeProvider, useTheme } from '@shared/themeContext';
import * as Calendar from 'expo-calendar';
import { useAuth } from '@hooks/useSupabaseAuth';
import { useQuery } from '@tanstack/react-query';
import { getShifts, type Shift } from '@features/shifts/shiftsService';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const hiddenTopBarPaths = ['/login', '/signup', '/guest'];

function LayoutContentInner() {
  const pushToken = useExpoPushToken();
  const pathname = usePathname();
  const router = useRouter();
  const [quickActionMenuOpen, setQuickActionMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { selectedCalendars, toggleCalendarSelection } = useCalendarSelection();
  const [calendars, setCalendars] = useState<Calendar.Calendar[] | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { user, loading } = useAuth();
  const userId = user?.id;
  const { data: quickShifts = [] } = useQuery({
    queryKey: ['quickActionsShifts', userId],
    queryFn: () => getShifts(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
  useEffect(() => {
    if (loading) return;

    const authFreePaths = ['/login', '/signup', '/guest'];
    const isAuthFree = pathname ? authFreePaths.some((path) => pathname.startsWith(path)) : false;

    if (!user && !isAuthFree) {
      router.replace('/login');
    }
  }, [loading, pathname, router, user]);

  const shouldShowNotificationBell = pathname
    ? !hiddenTopBarPaths.some((path) => pathname.startsWith(path))
    : true;
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { unreadCount } = useNotifications();
  const { theme, mode } = useTheme();
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark';
  const statusBarBgColor = theme.surface;

  useEffect(() => {
    if (Constants.appOwnership === 'expo') {
      console.warn(
        'Remote push notifications are not available in Expo Go (SDK 53+). Use a dev build for push tokens.'
      );
      return;
    }

    let isMounted = true;

    (async () => {
      const { setNotificationHandler } = await import('expo-notifications');
      if (!isMounted) return;

      setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowAlert: true,
        }),
      });
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (pushToken) {
      console.log('Push token registered', pushToken);
    }
  }, [pushToken]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        if (mounted) {
          setCalendars([]);
        }
        return;
      }
      const available = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      if (mounted) {
        setCalendars(available);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const formatShiftTime = (shift: Shift) => {
    const start = new Date(shift.start);
    const end = new Date(shift.end);
    const dateLabel = start.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const startLabel = start.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    const endLabel = end.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return { dateLabel, startLabel, endLabel };
  };

  const buildReportHtml = (title: string, description: string) => {
    const shiftRows =
      quickShifts.length > 0
        ? quickShifts
            .map((shift) => {
              const { dateLabel, startLabel, endLabel } = formatShiftTime(shift);
              return `
                <tr>
                  <td>${dateLabel}</td>
                  <td>${startLabel}</td>
                  <td>${endLabel}</td>
                  <td>${shift.location ?? 'TBD'}</td>
                </tr>
              `;
            })
            .join('')
        : `
          <tr>
            <td colspan="4" style="text-align:center;">${t('reportNoShifts')}</td>
          </tr>
        `;
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #0f172a; }
            h1 { font-size: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; }
            th { background-color: #f1f5f9; text-align: left; }
            tr:nth-child(even) td { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${description}</p>
          <table>
            <thead>
              <tr>
                <th>${t('dayLabel')}</th>
                <th>${t('shiftStartLabel')}</th>
                <th>${t('shiftEndLabel')}</th>
                <th>${t('locationTbd')}</th>
              </tr>
            </thead>
            <tbody>
              ${shiftRows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handleGeneratePDF = async (reportType: 'monthly' | 'summary') => {
    if (isGeneratingReport) return;
    setIsGeneratingReport(true);
    const title =
      reportType === 'monthly' ? t('reportGeneratePdf') : t('reportDownloadSummary');
    const description =
      reportType === 'monthly' ? t('reportMonthlyDescribe') : t('reportSummaryDescribe');

    try {
      const html = buildReportHtml(title, description);
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: title,
        });
      } else {
        Alert.alert(t('reportGeneratedTitle'), t('reportGeneratedBody'));
      }
    } catch (error) {
      console.error('Failed to generate report', error);
      Alert.alert(t('reportFailedTitle'), t('reportFailedBody'));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: statusBarBgColor }]} edges={['top']}>
      <StatusBar
        translucent
        hidden={false}
        backgroundColor={statusBarBgColor}
        style={statusBarStyle}
      />
        {shouldShowNotificationBell && (
          <View style={[styles.topActions, { top: insets.top + 10 }]}>
            <View style={styles.notificationWrapper}>
              <NotificationBell />
            </View>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                {
                  backgroundColor: theme.surface,
                  shadowColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : '#0f172a',
                },
              ]}
              onPress={() => setQuickActionMenuOpen((prev) => !prev)}
            >
              <Ionicons name="flash-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        )}
        {quickActionMenuOpen && (
          <>
            <Pressable
              style={[
                StyleSheet.absoluteFillObject,
                styles.menuBackdrop,
                { backgroundColor: theme.overlay },
              ]}
              onPress={() => setQuickActionMenuOpen(false)}
            />
            <LinearGradient
              colors={[theme.surfaceElevated, theme.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.quickActionMenu,
                {
                  top: insets.top + 60,
                  maxHeight: windowHeight - insets.top - 80,
                  borderColor: theme.border,
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <ScrollView
                style={[styles.quickActionScroll, { maxHeight: windowHeight - insets.top - 120 }]}
                contentContainerStyle={styles.quickActionScrollContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                <Text
                  style={[
                    styles.quickActionMenuTitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {t('quickActionsMenuTitle')}
                </Text>
                <TouchableOpacity
                  style={styles.quickActionMenuItem}
                  onPress={() => {
                    setQuickActionMenuOpen(false);
                    router.push('/calendar');
                  }}
                >
                  <Text
                    style={[
                      styles.quickActionMenuItemText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {t('calendarMenuOpen')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionMenuItem}
                  onPress={() => setQuickActionMenuOpen(false)}
                >
                  <Text
                    style={[
                      styles.quickActionMenuItemText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {t('calendarMenuSync')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionMenuItem}
                  onPress={() => {
                    setQuickActionMenuOpen(false);
                    Linking.openURL('https://calendar.google.com');
                  }}
                >
                  <Text
                    style={[
                      styles.quickActionMenuItemText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {t('calendarMenuImportGoogle')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionMenuItem}
                  onPress={() => {
                    setQuickActionMenuOpen(false);
                    Linking.openURL('https://outlook.live.com/calendar/');
                  }}
                >
                  <Text
                    style={[
                      styles.quickActionMenuItemText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {t('calendarMenuImportOutlook')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={[
                    styles.sectionSeparator,
                    { backgroundColor: theme.borderSoft },
                  ]}
                />
                <Text
                  style={[
                    styles.quickActionListTitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {t('reportsTitle')}
                </Text>
                <TouchableOpacity
                  style={styles.quickActionMenuItem}
                  onPress={() => {
                    setQuickActionMenuOpen(false);
                    handleGeneratePDF('monthly');
                  }}
                >
                  <Text
                    style={[
                      styles.quickActionMenuItemText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {isGeneratingReport ? t('reportGenerating') : t('reportGeneratePdf')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionMenuItem}
                  onPress={() => {
                    setQuickActionMenuOpen(false);
                    handleGeneratePDF('summary');
                  }}
                >
                  <Text
                    style={[
                      styles.quickActionMenuItemText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {isGeneratingReport ? t('reportGenerating') : t('reportDownloadSummary')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={[
                    styles.quickActionList,
                    { borderTopColor: theme.borderSoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickActionListTitle,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {t('calendarMenuAvailable')}
                  </Text>
                  <Text
                    style={[
                      styles.quickActionSelectionHint,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {selectedCalendars.length
                      ? t('calendarMenuSelectionCount', { count: selectedCalendars.length })
                      : t('calendarMenuSelectionPrompt')}
                  </Text>
                  {calendars === null ? (
                    <Text
                      style={[
                        styles.quickActionListEmpty,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {t('calendarMenuLoading')}
                    </Text>
                  ) : calendars.length ? (
                    calendars.map((cal) => {
                      const isSelected = selectedCalendars.some((entry) => entry.id === cal.id);
                      return (
                        <TouchableOpacity
                          key={cal.id}
                          style={[
                            styles.quickActionListItem,
                            isSelected && styles.quickActionListItemSelected,
                            isSelected && {
                              backgroundColor: `${theme.primary}20`,
                            },
                          ]}
                          onPress={() =>
                            toggleCalendarSelection({
                              id: cal.id,
                              title: cal.title,
                              sourceName: cal.source?.name ?? cal.source?.type,
                            })
                          }
                        >
                          <View>
                            <Text
                              style={[
                                styles.quickActionListItemTitle,
                                { color: theme.textPrimary },
                              ]}
                            >
                              {cal.title}
                            </Text>
                            <Text
                              style={[
                                styles.quickActionListItemMeta,
                                { color: theme.textSecondary },
                              ]}
                            >
                              {cal.source?.name ?? cal.source?.type}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text style={styles.quickActionListEmpty}>{t('calendarMenuNoCalendars')}</Text>
                  )}
                </View>
              </ScrollView>
            </LinearGradient>
          </>
        )}
        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
  );
}

function LayoutContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutContentInner />
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SafeAreaProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CalendarSelectionProvider>
                <LayoutContent />
              </CalendarSelectionProvider>
            </ThemeProvider>
          </LanguageProvider>
        </SafeAreaProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
  },
  topActions: {
    position: 'absolute',
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  quickActionButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  notificationWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBackdrop: {
    zIndex: 25,
  },
  quickActionMenu: {
    position: 'absolute',
    right: 16,
    width: 200,
    borderRadius: 16,
    padding: 12,
    zIndex: 30,
    shadowColor: '#0f172a',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
    borderWidth: 1,
  },
  quickActionScroll: {
    maxHeight: 320,
  },
  quickActionScrollContent: {
    paddingBottom: 12,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  quickActionList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  quickActionListTitle: {
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: 6,
  },
  quickActionListItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickActionListItemTitle: {
    fontSize: 14,
    color: '#0f172a',
  },
  quickActionListItemMeta: {
    fontSize: 11,
    color: '#6b7280',
  },
  quickActionListEmpty: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickActionSelectionHint: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  quickActionListItemSelected: {
    backgroundColor: '#2563eb10',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  quickActionMenuTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#1f2937',
    marginBottom: 8,
  },
  quickActionMenuItem: {
    paddingVertical: 10,
  },
  quickActionMenuItemText: {
    fontSize: 14,
    color: '#1f2937',
  },
});
