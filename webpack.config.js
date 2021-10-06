const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './index.js'),
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name]_bundle.js",
  },

  plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
      new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};