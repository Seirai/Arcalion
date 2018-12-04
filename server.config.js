const path = require('path');
const webpack = require('webpack');
const WebpackNodeExternals = require('webpack-node-externals');
module.exports = {
  target: 'node',
  externals: [WebpackNodeExternals()],
  mode: 'development',
  entry: {
    app: ['./src/server.js']
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'server-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
};
