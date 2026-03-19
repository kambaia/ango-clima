import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { reverseGeocode } from '../services/geoService';

interface UseLocationResult {
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<{ city: string; lat: number; lon: number } | null>;
}

export const useLocation = (): UseLocationResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada');
        return null;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude: lat, longitude: lon } = location.coords;
      const city = await reverseGeocode(lat, lon);
      return { city, lat, lon };
    } catch (err: any) {
      setError(err.message || 'Erro ao obter localização');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getCurrentLocation };
};
