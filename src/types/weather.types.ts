export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  pressure: number;
  visibility: number;
  lat?: number;
  lon?: number;
}

export interface ForecastDay {
  date: string;
  dayOfWeek: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface GeoLocation {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface Province {
  name: string;
  capital: string;
  emoji: string;
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Detail: {
    city: string;
    province: string;
    lat?: number;
    lon?: number;
  };
};

export type HomeTabParamList = {
  Home: undefined;
  Search: undefined;
  Map: undefined;
  Favorites: undefined;
};
