import React, { useState, useRef, useCallback } from 'react';
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
import MapView, { Marker, Region, PROVIDER_DEFAULT } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { GeoLocation, RootStackParamList } from '@/types/weather.types';
import { useLocation } from '@/hooks/useLocation';
import { searchCities } from '@/services/geoService';
import SearchBar from '@/components/SearchBar';

type MapNavProp = StackNavigationProp<RootStackParamList, 'HomeTabs'>;

const ANGOLA_REGION: Region = {
  latitude: -11.2027,
  longitude: 17.8739,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const MapScreen = () => {
  const navigation = useNavigation<MapNavProp>();
  const mapRef = useRef<MapView>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GeoLocation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { loading: locationLoading, getCurrentLocation } = useLocation();

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (text.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchCities(text);
        setResults(data);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const handleSelectPlace = (place: GeoLocation) => {
    setSelectedPlace(place);
    setQuery(place.name);
    setResults([]);
    setShowResults(false);

    mapRef.current?.animateToRegion(
      {
        latitude: place.lat,
        longitude: place.lon,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      },
      800
    );
  };

  const handleViewWeather = (place: GeoLocation) => {
    navigation.navigate('Detail', {
      city: place.name,
      province: place.name,
      lat: place.lat,
      lon: place.lon,
    });
  };

  const handleMyLocation = async () => {
    const result = await getCurrentLocation();
    if (result) {
      const place: GeoLocation = {
        name: result.city,
        country: '',
        lat: result.lat,
        lon: result.lon,
      };
      setSelectedPlace(place);
      setQuery(result.city);
      setShowResults(false);
      mapRef.current?.animateToRegion(
        {
          latitude: result.lat,
          longitude: result.lon,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        800
      );
    } else {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedPlace(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={ANGOLA_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {selectedPlace && (
          <Marker
            coordinate={{ latitude: selectedPlace.lat, longitude: selectedPlace.lon }}
            title={selectedPlace.name}
            description={selectedPlace.country}
            pinColor="#2E7D32"
          />
        )}
      </MapView>

      {/* Search overlay */}
      <View style={styles.overlay}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              value={query}
              onChangeText={handleSearch}
              onClear={handleClear}
              placeholder="Pesquisar cidade no mapa..."
              loading={loading}
            />
          </View>
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={handleMyLocation}
            disabled={locationLoading}
          >
            <Ionicons name="locate" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Results dropdown */}
        {showResults && results.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={results}
              keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPlace(item)}
                >
                  <Ionicons name="location-outline" size={18} color="#4CAF50" style={styles.dropdownIcon} />
                  <View style={styles.dropdownText}>
                    <Text style={styles.dropdownName}>{item.name}</Text>
                    <Text style={styles.dropdownDetail}>
                      {item.state ? `${item.state}, ` : ''}{item.country}
                      {item.country === 'AO' ? ' 🇦🇴' : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* View weather button */}
      {selectedPlace && (
        <View style={styles.weatherCard}>
          <View style={styles.weatherCardLeft}>
            <Ionicons name="location" size={20} color="#2E7D32" />
            <View style={styles.weatherCardText}>
              <Text style={styles.weatherCardName}>{selectedPlace.name}</Text>
              {selectedPlace.country ? (
                <Text style={styles.weatherCardCountry}>{selectedPlace.country}</Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            style={styles.weatherBtn}
            onPress={() => handleViewWeather(selectedPlace)}
          >
            <Ionicons name="partly-sunny" size={16} color="#fff" />
            <Text style={styles.weatherBtnText}>Ver clima</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBarWrapper: {
    flex: 1,
  },
  locationBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 260,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownText: {
    flex: 1,
  },
  dropdownName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  dropdownDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  weatherCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  weatherCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  weatherCardText: {
    flex: 1,
  },
  weatherCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  weatherCardCountry: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  weatherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    gap: 6,
  },
  weatherBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default MapScreen;
