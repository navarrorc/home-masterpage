var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');

module.exports = function (config) {    
    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai'],

        files: [  
            'test/lib/jquery.min.js',
            'test/lib/q.js',                    
            'test/lib/sinon.js',                    
            'test/*-test.ts'            
        ],
        
      	preprocessors: {
          // add preprocessors 
			    '**/*.ts?(x)': ['webpack']			    
		    },
        
        // babelPreprocessor: {
        //   options: {
        //     presets: ['es2015'],
        //     sourceMap: 'inline'
        //   }
        // },
        
        webpack: {
          // webpack configuration  
          resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
          },        
          devtool: 'eval-source-map',
          // output: {
          //   filename: 'bundle.js'
          // },
          module: {
            loaders: [
              { 
                test: /\.tsx?$/, 
                exclude: node_modules_dir,
                loader: 'ts-loader',
                // query: {
                //   presets: ['react', 'es2015']
                // }
              }
            ]
          }          
        },        
        
        webpackServer: {
          noInfo: true //please don't spam the console when running in karma!
        },
        
        webpackMiddleware: {
          // webpack-dev-middleware configuration          
          noInfo:true
        },      
        
        //reporters: ['progress'],
        reporters: ['mocha'],
        
        // plugins: [
        //   'karma-webpack',
        //   'karma-mocha-reporter'
        // ],

        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

//        browsers: ['PhantomJS', 'Chrome', 'IE']
        browsers: ['PhantomJS'],
        customLaunchers: {
          IE10: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE10'
          },
          IE9: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE9'
          },
          IE8: {
            base: 'IE',
            'x-ua-compatible': 'IE=EmulateIE8'
          }
        }

    });
};