var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './public/js/index'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.js$/,
        loaders: [ 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
          test: /\.less$/,
          exclude: /node_modules/,
          loader: 'style!css!less'
      },
      { test: /\.eot|\.ttf|\.svg|\.woff2?/, loader: 'file?name=[name].[ext]' }
    ]
  }
};
