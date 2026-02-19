import { Linking } from 'react-native';
import { buildMapsSearchUrl } from './mapUrl';

export const openAddressInMaps = (address?: string | null) => {
  const url = buildMapsSearchUrl(address);
  if (!url) return;
  void Linking.openURL(url);
};
