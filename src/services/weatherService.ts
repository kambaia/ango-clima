import { WeatherData } from '../types/weather.types';
import { getWeather, getWeatherByCoords } from '../api/config';

const mapWeatherData = (data: any): WeatherData => ({
  city: data.name,
  country: data.sys?.country || '',
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: Math.round(data.wind?.speed * 3.6), // m/s to km/h
  description: data.weather[0]?.description || '',
  icon: data.weather[0]?.icon || '01d',
  pressure: data.main.pressure,
  visibility: Math.round((data.visibility || 0) / 1000), // m to km
  lat: data.coord?.lat,
  lon: data.coord?.lon,
});

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const data = await getWeather(city);
    if (data.cod === '404' || data.cod === 404) {
      throw new Error('Cidade não encontrada');
    }
    if (data.cod === 401) {
      throw new Error('Chave de API inválida');
    }
    return mapWeatherData(data);
  } catch (error: any) {
    if (error.message.includes('HTTP 404')) throw new Error('Cidade não encontrada');
    if (error.message.includes('HTTP 401')) throw new Error('Chave de API inválida');
    if (error.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw error;
  }
};

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const data = await getWeatherByCoords(lat, lon);
    if (data.cod === 401) throw new Error('Chave de API inválida');
    return mapWeatherData(data);
  } catch (error: any) {
    if (error.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw error;
  }
};
