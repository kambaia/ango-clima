import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import WeatherCard from "@/components/WeatherCard";
import ForecastItem from "@/components/ForecastItem";
import { useWeather } from "@/hooks/useWeather";
import { useForecast } from "@/hooks/useForecast";
import { useFavoritesStore } from "@/store/favoritesStore";
import { RootStackParamList } from "@/types/weather.types";

type DetailRouteProp = RouteProp<RootStackParamList, "Detail">;

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailRouteProp>();
  const { city, province, lat, lon } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather(lat !== undefined ? undefined : city, lat, lon);

  const {
    forecast,
    loading: forecastLoading,
    error: forecastError,
  } = useForecast(lat !== undefined ? undefined : city, lat, lon);

  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const cityKey = weather?.city || city;
  const favorite = isFavorite(cityKey);

  useEffect(() => {
    if (!weatherLoading && weather) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [weatherLoading, weather]);

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(cityKey);
    } else {
      addFavorite(cityKey);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{province}</Text>
          {weather && (
            <Text style={styles.headerSubtitle}>
              {weather.city}, {weather.country}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleFavoriteToggle}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={favorite ? "star" : "star-outline"}
            size={24}
            color={favorite ? "#FFC107" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {weatherLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>A carregar clima...</Text>
          </View>
        ) : weatherError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline" size={60} color="#ccc" />
            <Text style={styles.errorText}>{weatherError}</Text>
          </View>
        ) : weather ? (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.sectionTitle}>Clima Actual</Text>
            <WeatherCard weather={weather} />
          </Animated.View>
        ) : null}

        <Text style={styles.sectionTitle}>Previsão para 5 Dias</Text>
        {forecastLoading ? (
          <ActivityIndicator
            size="small"
            color="#4CAF50"
            style={{ marginTop: 12 }}
          />
        ) : forecastError ? (
          <Text style={styles.errorText}>{forecastError}</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastList}
          >
            {forecast.map((day, index) => (
              <ForecastItem key={index} forecast={day} />
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#A5D6A7",
    marginTop: 2,
  },
  favoriteButton: {
    padding: 4,
  },
  content: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a2e",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  errorText: {
    color: "#E53935",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
    marginHorizontal: 32,
  },
  forecastList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default DetailScreen;
