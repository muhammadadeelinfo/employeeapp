import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraView, BarCodeScanningResult, CameraPermissionResponse } from 'expo-camera';
import { PrimaryButton } from '@shared/components/PrimaryButton';
import { useLanguage } from '@shared/context/LanguageContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shared/themeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function QrClockInScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [permission, setPermission] = useState<CameraPermissionResponse | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      const response = await Camera.requestCameraPermissionsAsync();
      setPermission(response);
    })();
  }, []);

  const handleRequestPermission = async () => {
    const response = await Camera.requestCameraPermissionsAsync();
    setPermission(response);
  };

  const handleBarCodeScanned = ({ data }: BarCodeScanningResult) => {
    setScannedData(data);
    setIsScanning(false);
    Alert.alert(t('qrDetectedTitle'), t('qrDetectedMessage', { code: data }));
  };

  const safeAreaPadding = {
    paddingTop: 12 + insets.top,
    paddingBottom: 12 + insets.bottom,
  };

  if (!permission) {
    return (
    <SafeAreaView style={[styles.center, safeAreaPadding, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.textSecondary }}>{t('requestingCameraPermission')}</Text>
    </SafeAreaView>
  );
  }

  if (!permission?.granted) {
    return (
    <SafeAreaView style={[styles.center, safeAreaPadding, { backgroundColor: theme.background }]}>
      <Text style={[styles.error, { color: theme.fail }]}>{t('cameraPermissionRequired')}</Text>
      <PrimaryButton title={t('grantCameraAccess')} onPress={handleRequestPermission} />
    </SafeAreaView>
  );
  }

  return (
    <SafeAreaView
      style={[styles.container, safeAreaPadding, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <LinearGradient
        colors={[theme.heroGradientStart, theme.heroGradientEnd]}
        style={styles.hero}
      >
        <Text style={[styles.instructions, { color: theme.textSecondary }]}>{t('qrInstructions')}</Text>
      </LinearGradient>
      <View style={styles.preview}>
        <CameraView
          style={styles.camera}
          onBarCodeScanned={isScanning ? handleBarCodeScanned : undefined}
          barCodeScannerSettings={{
            barCodeTypes: ['qr', 'code128', 'code39'],
          }}
        />
      </View>
      {scannedData ? (
        <View style={[styles.scanResult, { backgroundColor: theme.surface }]}>
          <Text style={[styles.scanLabel, { color: theme.textSecondary }]}>{t('lastScanLabel')}</Text>
          <Text style={[styles.scanValue, { color: theme.textPrimary }]}>{scannedData}</Text>
        </View>
      ) : null}
      {!isScanning ? (
        <PrimaryButton
          title={t('scanAnotherBadge')}
          onPress={() => {
            setScannedData(null);
            setIsScanning(true);
          }}
          style={styles.button}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  hero: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 10,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 12,
  },
  preview: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  scanResult: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  scanLabel: {
    textTransform: 'uppercase',
    fontSize: 10,
  },
  scanValue: {
    marginTop: 4,
    fontWeight: '600',
  },
  button: {
    marginTop: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  error: {
    marginBottom: 12,
    color: '#dc2626',
    textAlign: 'center',
  },
});
