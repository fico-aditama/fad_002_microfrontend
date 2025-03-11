<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const weather = ref('Loading weather...');

onMounted(async () => {
  try {
    // Ganti YOUR_API_KEY dengan key OpenWeatherMap jika punya
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Jakarta&appid=85fffcb662081b5c678b00e00b99a2e2');
    weather.value = `Weather in Jakarta: ${response.data.weather[0].description}, Temp: ${Math.round(response.data.main.temp - 273.15)}°C`;
  } catch (error) {
    weather.value = 'Failed to load weather data';
  }
});
</script>

<template>
  <div class="weather-widget">
    <h2>Weather Today</h2>
    <p>{{ weather }}</p>
  </div>
</template>

<style scoped>
.weather-widget {
  padding: 20px;
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: center;
}
h2 {
  margin: 0 0 10px;
  font-size: 1.5rem;
}
p {
  margin: 0;
  font-size: 1rem;
}
</style>
