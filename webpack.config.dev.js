import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  debug: true,
  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // set to false to see a list of every file being bundled.
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/index'
  ],
  target: 'web',
  output: {
    path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './src'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
     preLoaders: [
        { test: /\.json$/, exclude: /node_modules/, loader: 'json'},
    ],
    loaders: [
      //{test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel']},
      //{test: /(\.css)$/, loader: ExtractTextPlugin.extract("css?sourceMap")},
      {test: /(\.css)$/, loaders: ['style', 'css?sourceMap']},
      {test: /\.json$/, loaders: ['json-loader']},
      // {test: /(\.css)$/, loaders: ['theme/css', 'css?sourceMap']},
      // {test: /(\.css)$/, loaders: ['assets/css', 'css?sourceMap']},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.(woff|woff2|eot)$/, loader: "url?prefix=font/&limit=5000"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
      {test: /\.(png|jpg|gif|jpeg|ttf|.ico)$/, loader: 'url-loader?limit=8192' }
    ]
  }
};
