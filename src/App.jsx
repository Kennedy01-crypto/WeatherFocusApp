import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const [currentWeather, forecast] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }`
        ),
      ]);

      setWeatherData({
        temp: Math.round(currentWeather.data.main.temp),
        condition: currentWeather.data.weather[0].main,
        humidity: currentWeather.data.main.humidity,
        wind: Math.round(currentWeather.data.wind.speed),
        feelsLike: Math.round(currentWeather.data.main.feels_like),
        icon: currentWeather.data.weather[0].icon,
      });

      // Process forecast data to get daily forecasts
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
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`weather-app ${getThemeClass()} ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <h1>Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
        <button type="button" onClick={toggleDarkMode} className="theme-toggle">
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
      <footer className="app-footer">
        <p>© Jim Kennedy 2025</p>
        <a
          href="https://jimkennedy.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          My Portfolio
        </a>
      </footer>
    </div>
  );
}

export default App;
