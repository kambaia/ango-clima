import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeoLocation, RootStackParamList } from '@/types/weather.types';
import { useLocation } from '@/hooks/useLocation';
import { searchCities } from '@/services/geoService';
import SearchBar from '@/components/SearchBar';



type SearchNavProp = StackNavigationProp<RootStackParamList, 'HomeTabs'>;

const HISTORY_KEY = '@angoclima_search_history';

const SearchScreen = () => {
  const navigation = useNavigation<SearchNavProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { loading: locationLoading, getCurrentLocation } = useLocation();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  };

  const saveToHistory = async (cityName: string) => {
    const updated = [cityName, ...history.filter((h) => h !== cityName)].slice(0, 5);
    setHistory(updated);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  };

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchCities(text);
        setResults(data);
      } catch (err: any) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [history]);

  const handleSelectCity = (location: GeoLocation) => {
    saveToHistory(location.name);
    navigation.navigate('Detail', {
      city: location.name,
      province: location.name,
      lat: location.lat,
      lon: location.lon,
    });
  };

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

  const renderResult = ({ item }: { item: GeoLocation }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectCity(item)}>
      <Ionicons name="location-outline" size={20} color="#4CAF50" style={styles.resultIcon} />
      <View style={styles.resultText}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultDetail}>
          {item.state ? `${item.state}, ` : ''}{item.country}
          {item.country === 'AO' ? ' 🇦🇴' : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesquisar</Text>
      </View>

      <View style={styles.searchSection}>
        <SearchBar
          value={query}
          onChangeText={handleSearch}
          onClear={() => { setQuery(''); setResults([]); }}
          placeholder="Pesquisar cidades de Angola e do mundo"
          loading={loading}
        />
        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleLocationPress}
          disabled={locationLoading}
        >
          <Ionicons name="location" size={18} color="#fff" />
          <Text style={styles.locationButtonText}>Usar minha localização</Text>
        </TouchableOpacity>
      </View>

      {query.length === 0 && history.length > 0 && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Pesquisas recentes</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearText}>Limpar</Text>
            </TouchableOpacity>
          </View>
          {history.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyItem}
              onPress={() => handleSearch(item)}
            >
              <Ionicons name="time-outline" size={18} color="#999" />
              <Text style={styles.historyText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {query.length === 0 && history.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="earth-outline" size={80} color="#A5D6A7" />
          <Text style={styles.emptyText}>Pesquisa cidades de Angola e do mundo</Text>
        </View>
      )}

      {query.length > 0 && !loading && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#A5D6A7" />
          <Text style={styles.emptyText}>Nenhuma cidade encontrada para "{query}"</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
        renderItem={renderResult}
        contentContainerStyle={styles.resultsList}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    justifyContent: 'center',
    gap: 8,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  historySection: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  clearText: {
    fontSize: 14,
    color: '#E53935',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  historyText: {
    fontSize: 15,
    color: '#1a1a2e',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  resultDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default SearchScreen;
