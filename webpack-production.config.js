/*Config for Production*/
// Webpack for Production (minified)
// remote server location
//var remoteDir = '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/assets'; // Prod homepage
var remoteDir = '//rushenterprises.sharepoint.com@SSL/sites/dev/_catalogs/masterpage/_Rushnet/home-masterpage/assets'; // Dev homepage
//var remoteDir = '//rushenterprises.sharepoint.com@SSL/sites/hr/_catalogs/masterpage/_Rushnet/home-masterpage/assets'; // Prod HR
//var remoteDir = '//rushenterprises.sharepoint.com@SSL/sites/newshub/_catalogs/masterpage/_Rushnet/home-masterpage/assets'; // Prod NewsHub
// var remoteDir = '//rushenterprises.sharepoint.com@SSL/search/_catalogs/masterpage/_Rushnet/home-masterpage/assets'; // Prod Search
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = exports = Object.create(require("./webpack.config.js"));
exports.plugins = [];
exports.plugins.push(new ExtractTextPlugin('styles.min.css'));
exports.plugins = exports.plugins.concat(
  //new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
  new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.min.js')
);
exports.devtool = 'sourcemap';
exports.output = Object.create(
  {
    path: remoteDir,
    filename: 'bundle.js'}
  );
exports.output.filename = exports.output.filename.replace(/\.js$/, ".min.js");
