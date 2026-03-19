import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import MapScreen from "../screens/MapScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import DetailScreen from "../screens/DetailScreen";
import {
  HomeTabParamList,
  RootStackParamList,
} from "@/types/weather.types";

const Tab = createBottomTabNavigator<HomeTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeTabs" component={TabNavigator} />
    <Stack.Screen name="Detail" component={DetailScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Search") {
          iconName = focused ? "search" : "search-outline";
        } else if (route.name === "Map") {
          iconName = focused ? "map" : "map-outline";
        } else {
          iconName = focused ? "star" : "star-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#4CAF50",
      tabBarInactiveTintColor: "#999",
      tabBarStyle: {
        backgroundColor: "#fff",
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        height: 100,
        paddingBottom: 50,
        paddingTop: 4
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarLabel: "Início" }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{ tabBarLabel: "Pesquisa" }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ tabBarLabel: "Mapa" }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{ tabBarLabel: "Favoritos" }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <HomeStack />
  </NavigationContainer>
);

export default AppNavigator;
