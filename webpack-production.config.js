/*Config for Production*/
// Webpack for Production (minified)

var remoteDir = '//rushnetrcn.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/assets'; // Dev Rushnet
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = exports = Object.create(require("./webpack.config.js"));
exports.plugins = [];
exports.plugins.push(new ExtractTextPlugin('styles.min.css'));
exports.plugins = exports.plugins.concat(
  new webpack.DefinePlugin({
    // A common mistake is not to stringify the "production" string. 
    'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
  }),
  new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false
      }
  }),
  new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.min.js')
);
//exports.devtool = ''; // no sourcemaps
exports.output = Object.create(
  {
    path: remoteDir,
    filename: 'bundle.js'}
  );
exports.output.filename = exports.output.filename.replace(/\.js$/, ".min.js");
