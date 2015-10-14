/*Config for Production*/
// Webpack for Production (minified)
// remote server location
var remoteDir = '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/assets';
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = exports = Object.create(require("./webpack.config.js"));
exports.plugins = [];
exports.plugins.push(new ExtractTextPlugin('styles.min.css'));
exports.plugins = exports.plugins.concat(
  new webpack.optimize.UglifyJsPlugin()
  //new webpack.SourceMapDevToolPlugin({filename: remoteDir +'/bundle.min.js.map'})
);
exports.devtool = 'sourcemap';
exports.output = Object.create(
  {
    path: remoteDir,
    filename: 'bundle.js'}
  );
exports.output.filename = exports.output.filename.replace(/\.js$/, ".min.js");
