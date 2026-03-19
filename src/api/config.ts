const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || 'sua_chave_aqui';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const getWeather = async (city: string) => {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const getWeatherByCoords = async (lat: number, lon: number) => {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const getForecast = async (city: string) => {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const getForecastByCoords = async (lat: number, lon: number) => {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const getGeoByCity = async (city: string) => {
  const res = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(city)},AO&limit=5&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const getGeoByCity_Global = async (city: string) => {
  const res = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const getGeoByCoords = async (lat: number, lon: number) => {
  const res = await fetch(
    `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export {
  API_KEY,
  BASE_URL,
  GEO_URL,
  getWeather,
  getWeatherByCoords,
  getForecast,
  getForecastByCoords,
  getGeoByCity,
  getGeoByCity_Global,
  getGeoByCoords,
};
