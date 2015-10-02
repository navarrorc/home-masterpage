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
    rename = require('gulp-rename'),
    buffer = require('gulp-buffer'),
    gulpIf = require('gulp-if'),
    fixWindowsSourceMaps = require('gulp-fix-windows-source-maps'),
    fs = require('fs');

var isWin = Boolean(~process.platform.indexOf('win'));
var appRoot = './typescript/app/';

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
var mapFilePath = jsfolders[0]; // server


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
function mapFileUrlComment(sourcemap, cb) {
  function unixifySourceMap(src){
    return src.replace(/\\/g, '/').replace(/^([A-Z]):\//, '/$1/');
  }
  sourcemap.sourceRoot('/sources/');
  sourcemap.mapSources(mold.mapPathRelativeTo(appRoot));
  if (isWin){
    // fixes the backslashes issue, only happens in Windows
    sourcemap.mapSources(mold.transformSources(unixifySourceMap)));
  }

  // write map file and return a sourceMappingUrl that points to it
  jsfolders.map(function(folder){
    fs.writeFile(folder + '/bundle.js.map', sourcemap.toJSON(2), 'utf-8', function (err) {
      if (err) return console.error(err);
      cb('//@ sourceMappingURL=' + path.basename(folder + '/bundle.js.map'));
    });
  });

}

gulp.task('compile-js', function() {
  log('Transpiling ts/tsx --> JavaScript using browserify')
  var bundler = browserify({
        baseDir: config.applicationDir,
        debug: true
      })
      .add(config.mainJs) // app.ts
      .plugin(tsify, {
        noImplicitAny: true,
        target: 'es5',
        declarationFiles: false,
        noExternalResolve: false,
        jsx: 'react',
        removeComments: true
      });

    return bundler.bundle()
          .on('error', console.error.bind(console))
          // .pipe(mold.transformSourcesRelativeTo(appRoot))
          // .pipe(gulpIf(isWin,mold.transformSources(unixifySourceMap))) // fixes the backslashes issue, only happens in Windows
          .pipe(mold.transform(mapFileUrlComment)) // extract source map and save in separate file
          // vinyl-source-stream makes the bundle compatible with gulp
          .pipe(source('bundle.js')) // Desired filename
          // Output the file
          .pipe(gulp.dest(jsfolders[0])) // local
          .pipe(debug({title: 'scripts'}))
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
