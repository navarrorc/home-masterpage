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

var browserify = require('browserify'), // Bundles JS
    streamify = require('gulp-streamify'),
    tsify = require('tsify'),
    exorcist = require('exorcist'),
    source = require('vinyl-source-stream'), // Use conventional text streams with Gulp
    mold = require('mold-source-map'),
    uglifyJs = require('gulp-uglify'),
    rename = require('gulp-rename');

var config = {
	//bowerDir: __dirname + '/bower_components',
	applicationDir: __dirname + '/typescript/app',
	//stylesDir: __dirname + '/styles',
	publicDir: __dirname + '/public',
  mainJs: __dirname + '/typescript/app/app.ts'
};


var folders = ['./builds/development/css', '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/css'];
var jsfolders = [__dirname + '/builds/development/js', '//rushenterprises.sharepoint.com@SSL/sites/rushnet/_catalogs/masterpage/_Rushnet/home-masterpage/js'];
var typescriptSources = ['typescript/app/**/**/*.ts','typescript/app/**/**/*.tsx' ];


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

/*
* Browserify w/ typescript
*/
gulp.task('compile-js', function() {
  log('Transpiling ts/tsx --> JavaScript using browserify')
  var bundler = browserify({
        baseDir: config.applicationDir,
        debug: true
      })
      .add(config.mainJs)
      .plugin(tsify, {
        noImplicitAny: true,
        target: 'es5',
        declarationFiles: false,
        noExternalResolve: false,
        jsx: 'react',
        module: 'commonjs',
        removeComments: true
      });

    return bundler.bundle()
          .on('error', console.error.bind(console))
          //.pipe(exorcist(jsfolders[0] + '/bundle.js.map','','/sources/', './typescript/app/')) // TODO:fix, cannot write .map to both places
          .pipe(exorcist(jsfolders[1] + '/bundle.js.map','','/sources/', './typescript/app/')) // server, we need it here for debugging in Chrome
          .pipe(source('bundle.js')) // gives streaming vinyl file object
          //.pipe(streamify(uglifyJs))
          //.pipe(rename('bundle.min.js'))
          .pipe(gulp.dest(jsfolders[0])) // local
          .pipe(gulp.dest(jsfolders[1])) // server
          .pipe(debug({title: 'scripts'}));
})

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
// function tsc(src, dest, out) {
//   var tsResult = gulp.src(src)
//     .pipe(sourcemaps.init())
//     .pipe(ts({
//       noImplicitAny: true,
//       target: 'es5',
//       declarationFiles: false,
//       out: out,
//       noExternalResolve: false,
//       jsx: 'react',
//       module: 'commonjs',
//       removeComments: true
//     }));
//
//   var js = tsResult.js
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest(dest));
//
//   var dts = tsResult.dts
//     .pipe(gulp.dest(dest));
//
//   return merge([js, dts]);
// }
//

// gulp.task('typescript', function () {
//   log('Compiling .ts/tsx --> JavaScript');
//
// 	var tasks = jsfolders.map(function(folder){
// 		return tsc(typescriptSources, folder, 'tsoutput.js')
// 			.pipe(debug({title: 'scripts'}));
// 	});
//
// 	return merge(tasks);
//
// 	// return tsc(typescriptSources, outputDir + 'js', 'tsoutput.js')
//   //   .pipe(debug({ title: 'scripts:' }));
//
// });

/**
 * watch
 */
gulp.task('watch', function () {
  log('Watching file changes for .ts/.tsx and .scss');
	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch(typescriptSources, ['compile-js']);
});


/**
 * Default Task
 */
gulp.task('default', ['compile-js','sass','watch']);
