import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useFavoritesStore } from '@/store/favoritesStore';
import { getWeatherByCity } from '@/services/weatherService';
import { WeatherData, RootStackParamList } from '@/types/weather.types';

type FavNavProp = StackNavigationProp<RootStackParamList, 'HomeTabs'>;

interface FavoriteWithWeather {
  city: string;
  weather?: WeatherData;
  loading: boolean;
  error?: string;
}

const FavoritesScreen = () => {
  const navigation = useNavigation<FavNavProp>();
  const { favorites, removeFavorite, loadFavorites } = useFavoritesStore();
  const [items, setItems] = useState<FavoriteWithWeather[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (cities: string[]) => {
    const initial = cities.map((city) => ({ city, loading: true }));
    setItems(initial);

    await Promise.all(
      cities.map(async (city) => {
        try {
          const data = await getWeatherByCity(city);
          setItems((prev) =>
            prev.map((item) =>
              item.city === city ? { city, weather: data, loading: false } : item
            )
          );
        } catch (err: any) {
          setItems((prev) =>
            prev.map((item) =>
              item.city === city ? { city, loading: false, error: err.message } : item
            )
          );
        }
      })
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites().then(() => {
        if (favorites.length > 0) {
          fetchWeather(favorites);
        } else {
          setItems([]);
        }
      });
    }, [])
  );

  useEffect(() => {
    if (favorites.length > 0) {
      fetchWeather(favorites);
    } else {
      setItems([]);
    }
  }, [favorites]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather(favorites);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: FavoriteWithWeather }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('Detail', { city: item.city, province: item.city })
      }
      activeOpacity={0.85}
    >
      <View style={styles.cardLeft}>
        {item.loading ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : item.weather ? (
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${item.weather.icon}@2x.png` }}
            style={styles.weatherIcon}
          />
        ) : (
          <Ionicons name="cloud-offline" size={40} color="#ccc" />
        )}
        <View style={styles.cardText}>
          <Text style={styles.cityName}>{item.city}</Text>
          {item.weather && (
            <Text style={styles.description}>{item.weather.description}</Text>
          )}
          {item.error && <Text style={styles.errorText}>{item.error}</Text>}
        </View>
      </View>
      <View style={styles.cardRight}>
        {item.weather && (
          <Text style={styles.temperature}>{item.weather.temperature}°C</Text>
        )}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.city)}
        >
          <Ionicons name="close-circle" size={22} color="#E53935" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerSubtitle}>{favorites.length} cidades guardadas</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={80} color="#A5D6A7" />
          <Text style={styles.emptyTitle}>Sem favoritos</Text>
          <Text style={styles.emptyText}>
            Adiciona províncias ou cidades aos teus favoritos usando a estrela ★
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.city}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A5D6A7',
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cityName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  description: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  temperature: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },
  removeButton: {
    padding: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
});

export default FavoritesScreen;
