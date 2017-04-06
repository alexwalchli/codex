var path = require('path')
var webpack = require('webpack')

module.exports = {
  debug: true,
  devtool: '#source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
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
      {
        test: /\.eot|\.ttf|\.svg|\.woff2?/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]' }
    ]
  }
}
