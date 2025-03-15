import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weather.css';
import clearIcon from './assets/clear.png';
import cloudIcon from './assets/cloud.png';
import drizzleIcon from './assets/drizzle.png';
import rainIcon from './assets/rain.png';
import snowIcon from './assets/snow.png';
import windIcon from './assets/wind.png';
import humidityIcon from './assets/humidity.png';

const allIcons = {
  '01d': clearIcon,
  '01n': clearIcon,
  '02d': cloudIcon,
  '02n': cloudIcon,
  '03d': cloudIcon,
  '03n': cloudIcon,
  '04d': drizzleIcon,
  '04n': drizzleIcon,
  '09d': rainIcon,
  '09n': rainIcon,
  '10d': rainIcon,
  '10n': rainIcon,
  '13d': snowIcon,
  '13n': snowIcon,
};

const WeatherWidget = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    try {
      setError('');
      // const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=85fffcb662081b5c678b00e00b99a2e2`;
      const response = await axios.get(url);
      const data = response.data;
      setWeatherData({
        city: data.name,
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherIcon: data.weather[0].icon,
      });
    } catch (err) {
      setError('Failed to load weather data.');
      setWeatherData(null);
    }
  };

  useEffect(() => {
    if (city) fetchWeather(city);
  }, [city]);

  return (
    <div className="weather">
      {error ? (
        <div className="text-danger text-center py-4">{error}</div>
      ) : weatherData ? (
        <>
          <img src={allIcons[weatherData.weatherIcon] || clearIcon} alt="Weather-Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.city}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidityIcon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={windIcon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-muted py-4">Loading...</div>
      )}
    </div>
  );
};

export default WeatherWidget;
