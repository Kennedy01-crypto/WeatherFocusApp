import React, { useContext, useState } from "react";
import AppFooter from "./AppFooter";
import "./App.css";
import { WeatherContext, WeatherProvider } from "./context/WeatherContext";

function App() {
  const {
    location,
    darkMode,
    weatherData,
    forecastData,
    loading,
    error,
    handleSearch,
    toggleDarkMode,
  } = useContext(WeatherContext);

  const [inputLocation, setInputLocation] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputLocation);
  };

  const getThemeClass = () => {
    if (!weatherData) return "";
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes("sun") || condition.includes("clear"))
      return "sunny-theme";
    if (condition.includes("rain") || condition.includes("drizzle"))
      return "rainy-theme";
    if (condition.includes("cloud")) return "cloudy-theme";
    return "";
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div
        className={`weather-app ${getThemeClass()} ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
      >
        <h1>Weather Focus App</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            placeholder="Enter city name"
          />
          <button type="submit">Search</button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="theme-toggle"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </form>

        {loading && <p>Loading weather data...</p>}
        {error && <p className="error">{error}</p>}

        {weatherData && (
          <div className="weather-container">
            <div className="weather-display">
              <h2>Weather in {location}</h2>
              <p>Temperature: {weatherData.temp}°F</p>
              <p>Feels Like: {weatherData.feelsLike}°F</p>
              <div className="weather-condition">
                <p>Condition: {weatherData.condition}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                  alt={weatherData.condition}
                />
              </div>
              <p>Humidity: {weatherData.humidity}%</p>
              <p>Wind: {weatherData.wind} mph</p>
            </div>

            {forecastData && (
              <div className="forecast-container">
                <h3>5-Day Forecast</h3>
                <div className="forecast-cards">
                  {forecastData.map((day, index) => (
                    <div key={index} className="forecast-card">
                      <p>{day.date}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                        alt={day.condition}
                      />
                      <p>{day.temp}°F</p>
                      <p>{day.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <WeatherProvider>
      <App />
    </WeatherProvider>
  );
}
