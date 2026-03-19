import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types/weather.types';
import { getWeatherByCity, getWeatherByCoordinates } from '../services/weatherService';

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useWeather = (city?: string, lat?: number, lon?: number): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!city && (lat === undefined || lon === undefined)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data: WeatherData;
      if (lat !== undefined && lon !== undefined) {
        data = await getWeatherByCoordinates(lat, lon);
      } else {
        data = await getWeatherByCity(city!);
      }
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar clima');
    } finally {
      setLoading(false);
    }
  }, [city, lat, lon]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refresh: fetchWeather };
};
