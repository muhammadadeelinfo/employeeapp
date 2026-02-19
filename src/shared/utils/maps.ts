import { Linking } from 'react-native';

export const openAddressInMaps = (address?: string | null) => {
  const normalizedAddress = address?.trim();
  if (!normalizedAddress) return;
  const query = encodeURIComponent(normalizedAddress);
  void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
};
