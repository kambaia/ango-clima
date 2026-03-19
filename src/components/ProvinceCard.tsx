import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Province } from '../types/weather.types';

interface ProvinceCardProps {
  province: Province;
  temperature?: number;
  icon?: string;
  loading?: boolean;
  isFavorite?: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

const SkeletonBox: React.FC<{ width: number | string; height: number; borderRadius?: number }> = ({
  width,
  height,
  borderRadius = 4,
}) => (
  <View
    style={[
      styles.skeleton,
      { width: width as any, height, borderRadius },
    ]}
  />
);

const ProvinceCard: React.FC<ProvinceCardProps> = ({
  province,
  temperature,
  icon,
  loading = false,
  isFavorite = false,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.leftSection}>
        <Text style={styles.emoji}>{province.emoji}</Text>
        <View style={styles.textSection}>
          <Text style={styles.provinceName}>{province.name}</Text>
          <Text style={styles.capitalName}>{province.capital}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        {loading ? (
          <View style={styles.loadingSection}>
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <SkeletonBox width={50} height={24} borderRadius={4} />
          </View>
        ) : (
          <View style={styles.weatherSection}>
            {icon && (
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
                style={styles.weatherIcon}
              />
            )}
            {temperature !== undefined && (
              <Text style={styles.temperature}>{temperature}°C</Text>
            )}
          </View>
        )}
        <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={22}
            color={isFavorite ? '#FFC107' : '#ccc'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  textSection: {
    flex: 1,
  },
  provinceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  capitalName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherSection: {
    alignItems: 'center',
    marginRight: 8,
  },
  weatherIcon: {
    width: 44,
    height: 44,
  },
  temperature: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  loadingSection: {
    alignItems: 'center',
    marginRight: 8,
    gap: 4,
  },
  skeleton: {
    backgroundColor: '#E8F5E9',
  },
  favoriteButton: {
    padding: 4,
  },
});

export default ProvinceCard;
