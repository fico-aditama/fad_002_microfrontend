<script setup lang="ts">
import { ref, onMounted } from "vue";
import "./weather.css";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const weatherData = ref<any>(null);
const errorMessage = ref("");

const baseUrl = 'http://localhost:5174'; // Tambah ini
const allIcons: { [key: string]: string } = {
  "01d": `${baseUrl}${clear_icon}`,
  "01n": `${baseUrl}${clear_icon}`,
  "02d": `${baseUrl}${cloud_icon}`,
  "02n": `${baseUrl}${cloud_icon}`,
  "03d": `${baseUrl}${cloud_icon}`,
  "03n": `${baseUrl}${cloud_icon}`,
  "04d": `${baseUrl}${drizzle_icon}`,
  "04n": `${baseUrl}${drizzle_icon}`,
  "09d": `${baseUrl}${rain_icon}`,
  "09n": `${baseUrl}${rain_icon}`,
  "10d": `${baseUrl}${rain_icon}`,
  "10n": `${baseUrl}${rain_icon}`,
  "13d": `${baseUrl}${snow_icon}`,
  "13n": `${baseUrl}${snow_icon}`,
};

const search = async () => {
  try {
    errorMessage.value = "";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Jakarta&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    const icon = allIcons[data.weather[0].icon] || `${baseUrl}${clear_icon}`;
    weatherData.value = {
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      temperature: Math.floor(data.main.temp),
      location: data.name,
      icon: icon,
    };
  } catch (error) {
    errorMessage.value = "Failed to load Jakarta weather data.";
    weatherData.value = null;
  }
};

onMounted(() => {
  search();
});
</script>

<template>
  <div class="weather">
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-else-if="weatherData">
      <img :src="weatherData.icon" alt="Weather-Icon" class="weather-icon" />
      <p class="temperature">{{ weatherData.temperature }}°C</p>
      <p class="location">{{ weatherData.location }}</p>
      <div class="weather-data">
        <div class="col">
          <img :src="humidity_icon" alt="Humidity" />
          <div>
            <p>{{ weatherData.humidity }} %</p>
            <span>Humidity</span>
          </div>
        </div>
        <div class="col">
          <img :src="wind_icon" alt="Wind Speed" />
          <div>
            <p>{{ weatherData.windSpeed }} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>