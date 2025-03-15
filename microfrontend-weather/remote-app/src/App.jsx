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
