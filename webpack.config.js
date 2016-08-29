/*Config for Development*/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var remoteDirDEV = '//rushnetrcn.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/assets/DEV'; // Dev Rushnet

var autoprefixer = require('autoprefixer');

module.exports = {
  debug: false,
  cache: true,
  devtool: 'sourcemap',
  noInfo: true,  
  context: path.resolve('./src/app'),
  entry: {
    // https://github.com/github/fetch Promise and fetch for older browsers (IE 11)
    app: ['babel-polyfill','./app'], // app.ts?x
    vendors: [
        'react', // v15.0.2
        'react-dom', // v15.0.2
        'react-modal', // v1.3.0
        'lodash', // v4.13.1
        'q', // v1.4.1
      ]
  },
  target: 'web',
  output: {
    path: remoteDirDEV, // destination of bundle.js
    //publicPath: '', // not used, see: https://github.com/petehunt/webpack-howto/blob/master/README.md#9-async-loading
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
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendors', /* filename= */'vendors.js')
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


