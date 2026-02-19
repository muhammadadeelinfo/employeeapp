export const MOBILE_STACK_BREAKPOINT = 430;
export const TABLET_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 1200;

export const shouldStackForCompactWidth = (width: number) =>
  width < MOBILE_STACK_BREAKPOINT;

export const getContentMaxWidth = (width: number): number | undefined => {
  if (width >= DESKTOP_BREAKPOINT) return 960;
  if (width >= TABLET_BREAKPOINT) return 820;
  return undefined;
};
