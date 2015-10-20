/*Config for Development*/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var node_modules_dir = path.join(__dirname, 'node_modules');

var config = {
  context: path.resolve('./src/app'),
  entry: './App', // App.ts
  output: {
    path: path.resolve('builds/dev'), // destination of bundle.js
    publicPath: '/builds/assets/',
    filename: 'bundle.js'
  },
  node: { // this is for feedparser
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  devServer: {
    contentBase: 'public'
  },
  /**
  * Turn on sourcemap
  **/
  //devtool: 'source-map',
  devtool: 'eval-source-map',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin()
    //new webpack.SourceMapDevToolPlugin({filename: './public/bundle.js.map'})
    new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: "json-loader" },
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src/app')
        ],
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      /**
      * CSS
      **/
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   loader: ExtractTextPlugin.extract('style-loader','css-loader!autoprefixer-loader')
      // },
      /**
      * SCSS
      **/
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src/sass')
        ],
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!autoprefixer-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, "./node_modules/compass-mixins/lib") + "&includePaths[]=" + path.resolve(__dirname, "./mixins/app_mixins"))
      }
    ]
  }
}

module.exports = config;
