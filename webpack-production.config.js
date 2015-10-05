// Webpack for Production (minified)
// remote server location
var remoteDir = '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/assets';
var webpack = require("webpack");
module.exports = exports = Object.create(require("./webpack.config.js"));
exports.plugins = exports.plugins.concat(
  new webpack.optimize.UglifyJsPlugin()
  //new webpack.SourceMapDevToolPlugin({filename: remoteDir +'/bundle.min.js.map'})
);

exports.output = Object.create(
  {
    path: remoteDir,
    filename: 'bundle.js'}
  );
exports.output.filename = exports.output.filename.replace(/\.js$/, ".min.js");




// var WebpackStrip = require('strip-loader');
// var devConfig = require('./webpack.config.js');
// var webpack = require('webpack');
// var stripLoader = {
//   test: [/\.js$/, /\.ts$/, /\.tsx$/],
//   exclude: /node_modules/,
//   loader: WebpackStrip.loader('')
// }
//
// devConfig.module.loaders.push(stripLoader);
// devConfig.plugins.concat(
//   new webpack.optimize.UglifyJsPlugin()
// );
//
// module.exports = devConfig;
