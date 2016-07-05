/*Config for Development*/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var node_modules_dir = path.join(__dirname, 'node_modules');
var remoteDirDEV = '//rushnetrcn.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/assets/DEV'; // Dev Rushnet

module.exports = {
  debug: false,
  devtool: 'sourcemap',
  noInfo: true,  
  context: path.resolve('./src/app'),
  entry: {
   // https://github.com/github/fetch Promise and fetch for older browsers (IE 11)
    // app: ['es6-promise','whatwg-fetch','./app'], // app.ts?x
    app: ['./app'], // app.ts?x
    vendors: [
        'react', // v15.0.2
        'react-dom',
        'react-modal',
        'lodash', // v4.13.1
        'q', // v1.4.1
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
          path.resolve(__dirname, "src/sass")
        ],
        //exclude: node_modules_dir,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!autoprefixer-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, "./node_modules/compass-mixins/lib") + "&includePaths[]=" + path.resolve(__dirname, "./mixins/app_mixins"))
      }
    ]
  }
}


