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
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js', // Pastikan Vue diimpor sebagai ESM
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          isCustomElement: tag => tag.startsWith('weather-'),
        };
        return options;
      });
  },
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});