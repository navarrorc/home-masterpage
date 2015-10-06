// see: http://jlongster.com/Backend-Apps-with-Webpack--Part-II
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    devConfig = require('./webpack.config.js'),
    prodConfig = require('./webpack-production.config.js'),
    webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    nodemon = require('nodemon');


function onBuild(done) {
  return function(err, stats) {
    if(err) {
      gutil.log('Error', err);
    }
    else {
      //console.log(stats.toString());
      gutil.log('onBuild', stats.toString({colors: true}));
    }

    if(done) {
      done();
    }
  }
}

/**
* Gulp Tasks
**/

//gulp.task('default', ['webpack:prod-watch','webpack:dev-watch'], function() {
gulp.task('default', ['webpack:prod-watch'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'builds/dev'),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  }).on('restart', function() {
    gutil.log('Restarted!');
  });
});

gulp.task('webpack:dev-build', function(done) {
  webpack(devConfig).run(onBuild(done));
});

gulp.task('webpack:dev-watch', function() {
  webpack(devConfig).watch(100, onBuild());
});

// Builds bundle for server (SharePoint Online)
gulp.task('webpack:prod-build', function(callback) {
  webpack(prodConfig).run(onBuild(done));
});

gulp.task('webpack:prod-watch', function() {
  webpack(prodConfig).watch(100, function(err, status) {
    onBuild() (err, status);
    nodemon.restart();
  });
});
