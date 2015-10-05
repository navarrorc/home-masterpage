var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve('./typescript/app'),
  entry: './app',
  output: {
    path: path.resolve('public/'), // destination location of bundle.js
    publicPath: '/public/assets/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'public'
  },
  // Turn on sourcemaps
  devtool: 'source-map',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  // Add minification
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
      // css
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!autoprefixer-loader')
      },
      // scss
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!autoprefixer-loader!sass-loader')
      }
    ]
  }
}
