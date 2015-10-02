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

function unixifySourceMap(src){
  return src.replace(/\\/g, '/').replace(/^([A-Z]):\//, '/$1/');
}
/*
* Browserify w/ typescript
*/
function mapFileUrlComment(sourcemap, cb) {
  sourcemap.sourceRoot('/sources/');

  // write map file and return a sourceMappingUrl that points to it
  jsfolders.map(function(folder){
    // writing to multiple locations
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
          .pipe(mold.transformSourcesRelativeTo(appRoot)) // example, './typescript/app/'
          .pipe(gulpIf(isWin, mold.transformSources(unixifySourceMap))) // fixes the backslashes issue, only happens in Windows
          .pipe(mold.transform(mapFileUrlComment)) // extract source map and save in separate file, to multiple locations if needed
          // vinyl-source-stream makes the bundle compatible with gulp
          .pipe(source('bundle.js')) // Desired filename
          // Output the file
          .pipe(buffer()) // per Jesse Warden, see: https://www.youtube.com/watch?v=5Z82cpVP_qo
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
			.pipe(gulp.dest(folder))
      .pipe(debug({title: 'sass'}));

	});
	return merge(tasks);
});

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
