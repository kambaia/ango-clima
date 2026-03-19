import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import ProvinceCard from '@/components/ProvinceCard';
import { getWeatherByCity } from '@/services/weatherService';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useLocation } from '@/hooks/useLocation';
import { Province, RootStackParamList } from '@/types/weather.types';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'HomeTabs'>;

const PROVINCES: Province[] = [
  { name: 'Luanda', capital: 'Luanda', emoji: '🏙️' },
  { name: 'Benguela', capital: 'Benguela', emoji: '🌊' },
  { name: 'Huambo', capital: 'Huambo', emoji: '🏔️' },
  { name: 'Bié', capital: 'Cuito', emoji: '🌿' },
  { name: 'Moxico', capital: 'Luena', emoji: '🌾' },
  { name: 'Cuando Cubango', capital: 'Menongue', emoji: '🦁' },
  { name: 'Cunene', capital: 'Ondjiva', emoji: '🌵' },
  { name: 'Namibe', capital: 'Moçâmedes', emoji: '🏜️' },
  { name: 'Huíla', capital: 'Lubango', emoji: '⛰️' },
  { name: 'Lunda Sul', capital: 'Saurimo', emoji: '💎' },
  { name: 'Lunda Norte', capital: 'Dundo', emoji: '💍' },
  { name: 'Malanje', capital: 'Malanje', emoji: '🌺' },
  { name: 'Uíge', capital: 'Uíge', emoji: '🌳' },
  { name: 'Zaire', capital: 'Mbanza Kongo', emoji: '🏛️' },
  { name: 'Cabinda', capital: 'Cabinda', emoji: '🛢️' },
  { name: 'Bengo', capital: 'Caxito', emoji: '🌴' },
  { name: 'Cuanza Norte', capital: 'Ndalatando', emoji: '🌊' },
  { name: 'Cuanza Sul', capital: 'Sumbe', emoji: '🌅' },
];

interface ProvinceWeather {
  temperature?: number;
  icon?: string;
  loading: boolean;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();
  const { favorites, addFavorite, removeFavorite, isFavorite, loadFavorites } = useFavoritesStore();
  const { loading: locationLoading, getCurrentLocation } = useLocation();
  const [weatherData, setWeatherData] = useState<Record<string, ProvinceWeather>>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const fetchAllWeather = useCallback(async () => {
    // Initialize loading states
    const initialState: Record<string, ProvinceWeather> = {};
    PROVINCES.forEach((p) => {
      initialState[p.name] = { loading: true };
    });
    setWeatherData(initialState);

    // Fetch all in parallel with batching to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < PROVINCES.length; i += batchSize) {
      const batch = PROVINCES.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (province) => {
          try {
            const data = await getWeatherByCity(province.capital);
            setWeatherData((prev) => ({
              ...prev,
              [province.name]: {
                temperature: data.temperature,
                icon: data.icon,
                loading: false,
              },
            }));
          } catch {
            setWeatherData((prev) => ({
              ...prev,
              [province.name]: { loading: false },
            }));
          }
        })
      );
    }
  }, []);

  useEffect(() => {
    fetchAllWeather();
  }, [fetchAllWeather]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllWeather();
    setRefreshing(false);
  }, [fetchAllWeather]);

  const handleLocationPress = async () => {
    const result = await getCurrentLocation();
    if (result) {
      navigation.navigate('Detail', {
        city: result.city,
        province: result.city,
        lat: result.lat,
        lon: result.lon,
      });
    } else {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    }
  };

  const handleFavoritePress = (province: Province) => {
    if (isFavorite(province.capital)) {
      removeFavorite(province.capital);
    } else {
      addFavorite(province.capital);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AngoClima</Text>
          <Text style={styles.headerSubtitle}>18 Províncias de Angola</Text>
        </View>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleLocationPress}
          disabled={locationLoading}
        >
          <Ionicons name="location" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={PROVINCES}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ProvinceCard
            province={item}
            temperature={weatherData[item.name]?.temperature}
            icon={weatherData[item.name]?.icon}
            loading={weatherData[item.name]?.loading ?? true}
            isFavorite={isFavorite(item.capital)}
            onPress={() =>
              navigation.navigate('Detail', { city: item.capital, province: item.name })
            }
            onFavoritePress={() => handleFavoritePress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A5D6A7',
    marginTop: 2,
  },
  locationButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 50,
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 24,
  },
});

export default HomeScreen;
