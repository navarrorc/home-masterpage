/*Config for Development*/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var node_modules_dir = path.join(__dirname, 'node_modules');
var remoteDirDEV = '//rushnetrcn.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/assets/DEV'; // Dev Rushnet

var autoprefixer = require('autoprefixer');

var config = {
  // debug: true,
  cache: true,
  // noInfo: false,
  devtool: 'source-map',
  context: path.resolve('./src/app'),
  entry: {
   // https://github.com/github/fetch Promise and fetch for older browsers (IE 11)
    // app: ['es6-promise','whatwg-fetch','./app'], // app.ts?x
    app: ['./app'], // app.ts?x
    vendor: [
        'react', 
        'react-dom',
        'react-modal',
        'lodash',
        'q',
      ]
  },
  target: 'web',
  output: {
    path: remoteDirDEV, //path.resolve('builds/dev'), // destination of bundle.js
    // publicPath: '/builds/assets/', // not used
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'public'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js','.json']
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendors.js')
  ],
  module: {       
    loaders: [
      /**
      * Json
      **/
      { 
        test: /\.json$/,         
        include: [
          path.resolve(__dirname, "src/app")
        ],
        //exclude: [/node_modules/, /test/],
        loader: "json-loader"
         
      },
      /**
      * TypeScript
      **/
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, "src/app")
        ],
        //exclude: [/node_modules/, /test/],
        loader: 'ts-loader'
      },
      /**
      * SCSS
      **/
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, "src/sass"),
          path.resolve(__dirname, "src/app")
        ],
        // exclude: node_modules_dir,
        // exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?includePaths[]=' 
            + path.resolve(__dirname, "./node_modules/compass-mixins/lib") + "&includePaths[]=" 
            + path.resolve(__dirname, "./mixins/app_mixins"))       
      }
    ]
  },
  postcss: function () {
    return [autoprefixer]; // https://github.com/postcss/postcss-loader
  }
}

module.exports = config;
