import { GeoLocation } from '../types/weather.types';
import { getGeoByCity, getGeoByCity_Global, getGeoByCoords } from '../api/config';

const mapGeoData = (item: any): GeoLocation => ({
  name: item.name,
  country: item.country,
  state: item.state,
  lat: item.lat,
  lon: item.lon,
});

export const searchCities = async (query: string): Promise<GeoLocation[]> => {
  if (!query || query.length < 2) return [];
  try {
    // First search Angola
    const aoData = await getGeoByCity(query);
    const globalData = await getGeoByCity_Global(query);

    const aoResults: GeoLocation[] = Array.isArray(aoData) ? aoData.map(mapGeoData) : [];
    const globalResults: GeoLocation[] = Array.isArray(globalData)
      ? globalData.filter((item: any) => item.country !== 'AO').map(mapGeoData)
      : [];

    // Angola results first, then global
    const combined = [...aoResults, ...globalResults];
    // Remove duplicates by lat/lon
    const unique = combined.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.lat === item.lat && t.lon === item.lon)
    );

    return unique.slice(0, 8);
  } catch (error: any) {
    if (error.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw error;
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const data = await getGeoByCoords(lat, lon);
    if (Array.isArray(data) && data.length > 0) {
      return data[0].name;
    }
    return 'Localização desconhecida';
  } catch (error: any) {
    if (error.message.includes('Network request failed')) throw new Error('Sem conexão com a internet');
    throw error;
  }
};
