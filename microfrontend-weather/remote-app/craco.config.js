const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: 'remoteApp',
          filename: 'remoteEntry.js',
          exposes: {
            './WeatherWidget': './src/WeatherWidget.tsx',
          },
          shared: {
            react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
            axios: { singleton: true, eager: true },
          },
        }),
      ],
    },
  },
  devServer: {
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};