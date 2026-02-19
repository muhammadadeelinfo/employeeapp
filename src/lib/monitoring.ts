import Constants from 'expo-constants';
import * as Sentry from '@sentry/react-native';
import { initializeMissingTranslationMonitoring } from '@shared/utils/i18nUtils';

let monitoringInitialized = false;

const captureUnknownError = (reason: unknown) => {
  if (reason instanceof Error) {
    Sentry.captureException(reason);
    return;
  }
  Sentry.captureMessage(`Unhandled rejection: ${String(reason)}`, 'error');
};

const registerUnhandledPromiseTracking = () => {
  try {
    // React Native ships this helper for unhandled promise rejection hooks.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const tracking = require('promise/setimmediate/rejection-tracking');
    tracking.enable({
      allRejections: true,
      onUnhandled: (_id: unknown, error: unknown) => {
        console.error('Unhandled promise rejection', error);
        captureUnknownError(error);
      },
      onHandled: () => {},
    });
  } catch (error) {
    console.warn('Failed to enable promise rejection tracking', error);
  }
};

const registerGlobalJsHandler = () => {
  const errorUtils = (globalThis as { ErrorUtils?: any }).ErrorUtils;
  if (!errorUtils?.setGlobalHandler || !errorUtils?.getGlobalHandler) {
    return;
  }

  const defaultHandler = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
    console.error('Unhandled global JS error', error);
    captureUnknownError(error);
    if (typeof defaultHandler === 'function') {
      defaultHandler(error, isFatal);
    }
  });
};

export const initializeMonitoring = () => {
  if (monitoringInitialized) return;
  monitoringInitialized = true;

  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const dsn = typeof extra.sentryDsn === 'string' ? extra.sentryDsn.trim() : '';
  const environment = typeof extra.expoStage === 'string' ? extra.expoStage : 'development';

  registerUnhandledPromiseTracking();
  registerGlobalJsHandler();
  initializeMissingTranslationMonitoring((message) => console.warn(message));

  if (!dsn) {
    if (!__DEV__) {
      console.warn('Sentry DSN missing. Monitoring runs in console-only mode.');
    }
    return;
  }

  Sentry.init({
    dsn,
    environment,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
    tracesSampleRate: 0.1,
  });
};
