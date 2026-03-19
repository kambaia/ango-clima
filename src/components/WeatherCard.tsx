import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { WeatherData } from '../types/weather.types';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <View style={styles.card}>
      <View style={styles.mainInfo}>
        <Image
          source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
          style={styles.icon}
        />
        <Text style={styles.temperature}>{weather.temperature}°C</Text>
      </View>
      <Text style={styles.description}>{weather.description}</Text>
      <Text style={styles.feelsLike}>Sensação térmica {weather.feelsLike}°C</Text>
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidade</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Vento</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Pressão</Text>
          <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Visibilidade</Text>
          <Text style={styles.detailValue}>{weather.visibility} km</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: 'center',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '800',
    color: '#2E7D32',
    marginLeft: 8,
  },
  description: {
    fontSize: 18,
    color: '#1a1a2e',
    textTransform: 'capitalize',
    marginTop: 4,
    textAlign: 'center',
  },
  feelsLike: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  detailItem: {
    width: '45%',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
});

export default WeatherCard;
