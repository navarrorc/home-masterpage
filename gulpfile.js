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
var sassSources = ['./sass/**/*.scss'];
gulp.task('sass', function() {
	log('Compiling Sass --> CSS');
	var tasks = folders.map(function(folder){
		return gulp.src(sassSources)
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer({browsers: ['last 2 versions', '> 5%']}))
      .pipe(debug({title: 'sass'}))
			.pipe(gulp.dest(folder));
	});
	return merge(tasks);
});


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
      module: 'commonjs',
      removeComments: true
    }));

  var js = tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));

  var dts = tsResult.dts
    .pipe(gulp.dest(dest));

  return merge([js, dts]);
}

var typescriptSources = ['typescript/app/**/**.ts','typescript/app/**/**.tsx' ];
gulp.task('typescript', function () {
  log('Compiling .ts/tsx --> JavaScript');
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
  log('Watching file changes for .ts/.tsx and .scss');
	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch(typescriptSources, ['typescript']);
});


/**
 * Default Task
 */
gulp.task('default', ['typescript','sass','watch']);
