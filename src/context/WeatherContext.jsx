import React, { createContext, useState } from "react";
import axios from "axios";

// Create a context for weather-related state and actions
export const WeatherContext = createContext();

// Provider component to wrap the app and provide weather state and actions
export const WeatherProvider = ({ children }) => {
  // State for the current location input by the user
  const [location, setLocation] = useState("");
  // State to track if dark mode is enabled
  const [darkMode, setDarkMode] = useState(false);
  // State to hold current weather data fetched from API
  const [weatherData, setWeatherData] = useState(null);
  // State to hold forecast data fetched from API
  const [forecastData, setForecastData] = useState(null);
  // State to indicate if data is currently being loaded
  const [loading, setLoading] = useState(false);
  // State to hold any error messages from API calls
  const [error, setError] = useState(null);

  // Function to fetch weather and forecast data for a given location
  const handleSearch = async (locationInput) => {
    if (!locationInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather and forecast data concurrently
      const [currentWeather, forecast] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=imperial&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&units=imperial&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }`
        ),
      ]);

      // Update weather data state with relevant information
      setWeatherData({
        temp: Math.round(currentWeather.data.main.temp),
        condition: currentWeather.data.weather[0].main,
        humidity: currentWeather.data.main.humidity,
        wind: Math.round(currentWeather.data.wind.speed),
        feelsLike: Math.round(currentWeather.data.main.feels_like),
        icon: currentWeather.data.weather[0].icon,
      });

      // Process forecast data to get daily forecasts (one per day)
      const dailyForecasts = forecast.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5);
      setForecastData(
        dailyForecasts.map((day) => ({
          date: new Date(day.dt * 1000).toLocaleDateString(),
          temp: Math.round(day.main.temp),
          icon: day.weather[0].icon,
          condition: day.weather[0].main,
        }))
      );
      // Update location state with the searched location
      setLocation(locationInput);
    } catch (err) {
      // Set error message if API call fails
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      // Reset loading state after API call completes
      setLoading(false);
    }
  };

  // Function to toggle dark mode on/off
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Provide state and functions to children components via context
  return (
    <WeatherContext.Provider
      value={{
        location,
        darkMode,
        weatherData,
        forecastData,
        loading,
        error,
        handleSearch,
        toggleDarkMode,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
