/**
 * ************************************
 *
 * @module  webpack.config.js
 * @description Webpack Configuration
 *
 * ************************************
 */

const HTMLWebpack = require('html-webpack-plugin');
const path = require('path');

const HTMLWebPackPlugin = new HTMLWebpack({
  template: path.resolve(__dirname, '../src/index.html'),
  filename: 'index.html',
});

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/index.jsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),             // Output bundle file to root/dist
    filename: 'bundle.js',                                // Bundle file name
    publicPath: '/',                                      // Specify base path for all assets as root
  },
  devServer: {
    // Required for Docker to work with dev server
    host: '0.0.0.0',
    port: 8080,
    // match the output path
    contentBase: path.resolve(__dirname, '../dist'),
    //enable HMR on the devServer
    hot: true,
    //match the output 'publicPath'
    publicPath: '/',
    // fallback to root for other urls
    historyApiFallback: true,

    inline: true,

    headers: { 'Access-Control-Allow-Origin': '*' },
    // proxy is required in order to make api calls to express server while using hot-reload webpack server
    // routes api fetch requests from localhost:8080/api/* (webpack dev server) to localhost:3000/api/* (where our Express server is running
  

    proxy: {
      '/api/**': {
        target: 'http://localhost:3000/',
        secure: false,
      },
    },
  },
  // devServer: {
  //   compress: true,                                       // GZIP Compression
  //   contentBase: path.resolve(__dirname, '../dist'),      // Serve static content from ../dist
  //   historyApiFallback: true,                             // Redirect 404s back to /index.html
  //   proxy: {
  //     '/api': {                                           // Proxy requests to '8080/api' route
  //       target: 'http://localhost:3000',                  // Proxy 8080 to 3000
  //     },
  //   },
  //   port: 8080,                                           // Specify PORT for requests
  // },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    //   {
    //     enforce: 'pre',
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     use: {
    //       loader: 'source-map-loader',
    //     },
    //   },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [HTMLWebPackPlugin],
};
