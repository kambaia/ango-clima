import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ForecastDay } from '../types/weather.types';

interface ForecastItemProps {
  forecast: ForecastDay;
}

const ForecastItem: React.FC<ForecastItemProps> = ({ forecast }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{forecast.date}</Text>
      <Image
        source={{ uri: `https://openweathermap.org/img/wn/${forecast.icon}@2x.png` }}
        style={styles.icon}
      />
      <Text style={styles.description} numberOfLines={2}>{forecast.description}</Text>
      <View style={styles.temps}>
        <Text style={styles.tempMax}>{forecast.tempMax}°</Text>
        <Text style={styles.tempMin}>{forecast.tempMin}°</Text>
      </View>
      <Text style={styles.detail}>💧 {forecast.humidity}%</Text>
      <Text style={styles.detail}>💨 {forecast.windSpeed} km/h</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    width: 130,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  date: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '600',
  },
  icon: {
    width: 50,
    height: 50,
  },
  description: {
    fontSize: 11,
    color: '#1a1a2e',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginVertical: 4,
    minHeight: 30,
  },
  temps: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tempMax: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53935',
  },
  tempMin: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1565C0',
  },
  detail: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});

export default ForecastItem;
