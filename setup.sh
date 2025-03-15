#!/bin/bash

# Pastikan di direktori yang bersih
echo "Memulai setup microfrontend-weather..."
rm -rf microfrontend-weather
mkdir microfrontend-weather
cd microfrontend-weather

# Buat API Key (ganti dengan milikmu)
API_KEY="85fffcb662081b5c678b00e00b99a2e2"

# --- Setup Remote App (React.js + Webpack) ---
echo "Menyiapkan Remote App (React.js)..."
mkdir remote-app
cd remote-app
npm init -y > /dev/null 2>&1
npm install react@18.2.0 react-dom@18.2.0 axios --save > /dev/null 2>&1
npm install webpack webpack-cli webpack-dev-server @babel/core @babel/preset-env @babel/preset-react babel-loader html-webpack-plugin style-loader css-loader --save-dev > /dev/null 2>&1

# Buat .env
echo "REACT_APP_API_KEY=$API_KEY" > .env

# Buat folder dan file
mkdir -p src/assets public

# Buat webpack.config.js
cat <<EOL > webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    publicPath: 'http://localhost:3000/',
  },
  devServer: {
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './WeatherWidget': './src/WeatherWidget.jsx',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        axios: { singleton: true, eager: true, requiredVersion: '^1.6.0' },
      },
    }),
  ],
  resolve: {
    extensions: ['.jsx', '.js'],
  },
};
EOL

# Buat public/index.html
cat <<EOL > public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Remote App - Weather</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
EOL

# Buat src/WeatherWidget.jsx
cat <<EOL > src/WeatherWidget.jsx
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
      const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${cityName}&units=metric&appid=\${process.env.REACT_APP_API_KEY}\`;
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
EOL

# Buat src/weather.css
cat <<EOL > src/weather.css
.weather {
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.temperature {
  font-size: 2rem;
  font-weight: bold;
  margin: 10px 0;
}

.location {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.weather-data {
  display: flex;
  justify-content: space-around;
}

.col {
  display: flex;
  align-items: center;
  gap: 10px;
}

.col img {
  width: 30px;
  height: 30px;
}

.col p {
  margin: 0;
  font-size: 1.2rem;
}

.col span {
  font-size: 0.9rem;
  color: #666;
}
EOL

# Buat src/App.jsx
cat <<EOL > src/App.jsx
import React, { useState } from 'react';
import WeatherWidget from './WeatherWidget';

const App = () => {
  const [city, setCity] = useState('Jakarta');

  const handleSearch = (e) => {
    e.preventDefault();
    const inputCity = e.target.elements.city.value.trim();
    setCity(inputCity || 'Jakarta');
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Weather App (Remote)</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          name="city"
          placeholder="Enter city (e.g., Surabaya)"
          style={{ padding: '10px', width: '200px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Search</button>
      </form>
      <WeatherWidget city={city} />
    </div>
  );
};

export default App;
EOL

# Buat src/index.jsx
cat <<EOL > src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
EOL

# Update package.json untuk script
sed -i 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"start": "webpack-dev-server --mode development"/' package.json

# Tambah placeholder untuk assets
echo "Silakan tambahkan gambar ke src/assets: clear.png, cloud.png, drizzle.png, rain.png, snow.png, wind.png, humidity.png"

cd ..

# --- Setup Host App (Vue.js + Webpack) ---
echo "Menyiapkan Host App (Vue.js)..."
npx @vue/cli create host-app --default --force > /dev/null 2>&1
cd host-app
npm install vue bootstrap animate.css --save > /dev/null 2>&1
npm install vue-loader@next @vue/compiler-sfc css-loader style-loader vue-style-loader @module-federation/webpack --save-dev > /dev/null 2>&1

# Buat vue.config.js
cat <<EOL > vue.config.js
const { defineConfig } = require('@vue/cli-service');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = defineConfig({
  publicPath: 'http://localhost:8080/',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new ModuleFederationPlugin({
        name: 'hostApp',
        remotes: {
          remoteApp: 'remoteApp@http://localhost:3000/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
          'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
          axios: { singleton: true, eager: true, requiredVersion: '^1.6.0' },
        },
      }),
    ],
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader');
  },
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
EOL

# Update src/main.js
cat <<EOL > src/main.js
import Vue from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';

new Vue({
  render: h => h(App),
}).\$mount('#app');
EOL

# Update src/App.vue
cat <<EOL > src/App.vue
<template>
  <div
    class="min-vh-100 d-flex flex-column align-items-center justify-content-center"
    style="background: linear-gradient(135deg, #007bff 0%, #6610f2 50%, #6f42c1 100%); background-attachment: fixed;"
  >
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-6">
          <div class="card border-0 shadow-lg rounded-4 bg-white bg-opacity-95 p-4 p-md-5 animate__animated animate__zoomIn">
            <div class="card-body">
              <h1 class="card-title text-center mb-4 fw-bold display-4 text-primary animate__animated animate__fadeIn">
                Weather Dashboard
              </h1>

              <!-- Search Bar -->
              <form @submit.prevent="handleSearch" class="mb-5">
                <div class="input-group input-group-lg">
                  <input
                    v-model="cityInput"
                    type="text"
                    name="city"
                    class="form-control py-3 px-4 border-0 shadow-sm"
                    placeholder="Enter city (e.g., Surabaya)"
                    style="border-radius: 1.5rem 0 0 1.5rem; background-color: #f8f9fa;"
                  />
                  <button
                    type="submit"
                    class="btn btn-primary px-5 py-3 rounded-end-pill shadow-sm"
                    style="background-color: #0d6efd; border-color: #0d6efd;"
                  >
                    Search
                  </button>
                </div>
              </form>

              <!-- Weather Widget -->
              <div class="row justify-content-center">
                <div class="col-12">
                  <weather-widget :city="city" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="text-center text-white mt-5 py-4 w-100" style="background-color: rgba(0, 0, 0, 0.4);">
      <p class="mb-0 fw-light">Powered by xAI Microfrontend Technology © 2025</p>
    </footer>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'App',
  components: {
    WeatherWidget: defineAsyncComponent(() =>
      import('remoteApp/WeatherWidget')
    ),
  },
  data() {
    return {
      city: 'Jakarta',
      cityInput: '',
    };
  },
  methods: {
    handleSearch() {
      this.city = this.cityInput.trim() || 'Jakarta';
    },
  },
};
</script>
EOL

# # --- Jalankan Kedua App di Background ---
# echo "Menjalankan Remote App di port 3000..."
# cd ../remote-app
# npm start & > /dev/null 2>&1

# echo "Menjalankan Host App di port 8080..."
# cd ../host-app
# npm run serve & > /dev/null 2>&1

# # Tunggu sebentar agar server stabil
# sleep 5

# # Verifikasi remoteEntry.js
# echo "Memeriksa remoteEntry.js..."
# curl -v http://localhost:3000/remoteEntry.js

# echo "Setup selesai!"
# echo "Buka http://localhost:8080 untuk Host App (Vue.js)"
# echo "Remote App (React.js) berjalan di http://localhost:3000 dengan WeatherWidget"