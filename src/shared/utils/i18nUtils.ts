type MissingTranslationPayload = {
  key: string;
  reason: 'missing' | 'empty';
};

let missingTranslationHandler:
  | ((payload: MissingTranslationPayload) => void)
  | null = null;

export const setMissingTranslationHandler = (
  handler: ((payload: MissingTranslationPayload) => void) | null
) => {
  missingTranslationHandler = handler;
};

export const createMissingTranslationLogger =
  (logger: (message: string) => void) =>
  (payload: MissingTranslationPayload) => {
    logger(`[i18n] Missing translation (${payload.reason}): ${payload.key}`);
  };

export const initializeMissingTranslationMonitoring = (
  logger: (message: string) => void = console.warn
) => {
  setMissingTranslationHandler(createMissingTranslationLogger(logger));
};

export const getTranslationValue = (
  dictionary: Record<string, string>,
  key: string
): string => {
  const value = dictionary[key];
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  if (typeof value === 'string' && value.length === 0) {
    missingTranslationHandler?.({ key, reason: 'empty' });
  } else {
    missingTranslationHandler?.({ key, reason: 'missing' });
  }
  return key;
};
