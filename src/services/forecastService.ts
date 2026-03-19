import { ForecastDay } from '../types/weather.types';
import { getForecast, getForecastByCoords } from '../api/config';

const DAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const groupForecastByDay = (list: any[]): ForecastDay[] => {
  const grouped: { [key: string]: any[] } = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  const result: ForecastDay[] = [];
  const today = new Date().toISOString().split('T')[0];

  Object.keys(grouped)
    .filter((key) => key !== today)
    .slice(0, 5)
    .forEach((dateKey) => {
      const items = grouped[dateKey];
      const noonItem = items.find((item) => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour === 12 || hour === 11 || hour === 13;
      }) || items[Math.floor(items.length / 2)];

      const temps = items.map((i) => i.main.temp);
      const date = new Date(dateKey + 'T12:00:00');
      const dayOfWeek = DAYS_PT[date.getDay()];
      const month = MONTHS_PT[date.getMonth()];
      const day = date.getDate();

      result.push({
        date: `${dayOfWeek}, ${day} ${month}`,
        dayOfWeek,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        description: noonItem.weather[0]?.description || '',
        icon: noonItem.weather[0]?.icon || '01d',
        humidity: noonItem.main.humidity,
        windSpeed: Math.round(noonItem.wind?.speed * 3.6),
      });
    });

  return result;
};

export const getForecastByCity = async (city: string): Promise<ForecastDay[]> => {
  try {
    const data = await getForecast(city);
    if (data.cod === '404' || data.cod === 404) throw new Error('Cidade não encontrada');
    if (data.cod === 401) throw new Error('Chave de API inválida');
    return groupForecastByDay(data.list);
  } catch (error: any) {
    if (error.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw error;
  }
};

export const getForecastByCoordinates = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  try {
    const data = await getForecastByCoords(lat, lon);
    if (data.cod === 401) throw new Error('Chave de API inválida');
    return groupForecastByDay(data.list);
  } catch (error: any) {
    if (error.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw error;
  }
};
