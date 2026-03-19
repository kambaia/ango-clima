import { useState, useEffect, useCallback } from 'react';
import { ForecastDay } from '../types/weather.types';
import { getForecastByCity, getForecastByCoordinates } from '../services/forecastService';

interface UseForecastResult {
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useForecast = (city?: string, lat?: number, lon?: number): UseForecastResult => {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    if (!city && (lat === undefined || lon === undefined)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data: ForecastDay[];
      if (lat !== undefined && lon !== undefined) {
        data = await getForecastByCoordinates(lat, lon);
      } else {
        data = await getForecastByCity(city!);
      }
      setForecast(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar previsão');
    } finally {
      setLoading(false);
    }
  }, [city, lat, lon]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return { forecast, loading, error, refresh: fetchForecast };
};
