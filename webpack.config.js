const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },

  output: {
    library: 'App',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-react'],
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

module.exports = CONFIG;
