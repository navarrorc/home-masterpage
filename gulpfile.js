'use strict';

var gulp = require('gulp'),
    path = require('path'),
		merge = require('merge-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    util = require('gulp-util'),
		ts = require('gulp-typescript'),
		sourcemaps = require('gulp-sourcemaps'),
		debug = require('gulp-debug');

var folders = ['./builds/development/css', '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/css'];
var jsfolders = ['./builds/development/js', '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/js'];


/**
 * Custom Functions
 */
function log(msg) {
	if (typeof (msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				util.log(util.colors.blue(msg[item]));
			}
		}
	} else {
		util.log(util.colors.blue(msg));
	}
}

/**
 * sass
 */
gulp.task('sass', function() {
	log('Compiling Sass --> CSS');

	var tasks = folders.map(function(element){
		return gulp.src('./sass/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer({browsers: ['last 2 versions', '> 5%']}))
			.pipe(gulp.dest(element));
	});

	return merge(tasks);
});

var typescriptSources = ['typescript/app/**/**.ts','typescript/app/**/**.tsx' ];

/**
 * typescript
 */
function tsc(src, dest, out) {
  var tsResult = gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(ts({
      noImplicitAny: true,
      target: 'es5',
      declarationFiles: false,
      out: out,
      noExternalResolve: false,
      jsx: 'react',
      module: 'commonjs'
    }));

  var js = tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));

  var dts = tsResult.dts
    .pipe(gulp.dest(dest));

  return merge([js, dts]);
}
gulp.task('typescript', function () {

	var tasks = jsfolders.map(function(folder){
		return tsc(typescriptSources, folder, 'tsoutput.js')
			.pipe(debug({title: 'scripts'}));
	});

	return merge(tasks);

	// return tsc(typescriptSources, outputDir + 'js', 'tsoutput.js')
  //   .pipe(debug({ title: 'scripts:' }));

});

/**
 * watch
 */
gulp.task('watch', function () {
	gulp.watch('sass/*.scss', ['sass']);
	gulp.watch(typescriptSources, ['typescript']);
});


/**
 * Default Task
 */
gulp.task('default', ['typescript','sass','watch']);
