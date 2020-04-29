const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './src/app.js'
  },

  output: {
    library: 'App'
  },

  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-react']
        }
      }
    ]
  },

  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG'])]
};

// This line enables bundling against src in this repo rather than installed module
module.exports = CONFIG;
