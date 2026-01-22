'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const notifications = [
  { id: '1', title: 'Shift Reminder', detail: '8:00 AM – Lobby Coverage', time: '2m ago' },
  { id: '2', title: 'New QR Policy', detail: 'Review QR clock-in steps', time: '1h ago' },
  { id: '3', title: 'Weekend rota', detail: 'Open unpaid weekend bids', time: 'Yesterday' },
];

type NotificationContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      toggle: () => setOpen((prev) => !prev),
      close: () => setOpen(false),
    }),
    [open]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {open && (
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.panel} onPress={(event) => event.stopPropagation()}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Notifications</Text>
              <Text style={styles.panelMeta}>{notifications.length} waiting</Text>
            </View>
            {notifications.map((item) => (
              <View key={item.id} style={styles.notificationItem}>
                <View>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationDetail}>{item.detail}</Text>
                </View>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.actionButton} onPress={() => setOpen(false)}>
              <Text style={styles.actionText}>Mark all as read</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 20,
  },
  panel: {
    width: 300,
    borderRadius: 20,
    padding: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.6)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.65,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
    backdropFilter: 'blur(24px)',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  panelTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '700',
  },
  panelMeta: {
    color: '#b1bfed',
    fontSize: 12,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  notificationTitle: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  notificationDetail: {
    color: '#94a3b8',
    fontSize: 12,
  },
  notificationTime: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  actionButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.3)',
  },
  actionText: {
    color: '#e0e7ff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
