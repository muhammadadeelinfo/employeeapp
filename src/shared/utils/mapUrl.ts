export const buildMapsSearchUrl = (address?: string | null): string | undefined => {
  const normalizedAddress = address?.trim();
  if (!normalizedAddress) return undefined;
  const query = encodeURIComponent(normalizedAddress);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};
