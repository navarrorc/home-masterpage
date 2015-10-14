/*Config for Development*/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve('./src/app'),
  entry: './App', // App.ts
  output: {
    path: path.resolve('builds/dev'), // destination of bundle.js
    publicPath: '/builds/assets/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'public'
  },
  /**
  * Turn on sourcemap
  **/
  devtool: 'source-map',
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
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
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
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!autoprefixer-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, "./node_modules/compass-mixins/lib") + "&includePaths[]=" + path.resolve(__dirname, "./mixins/app_mixins"))
      }
    ]
  }
}
