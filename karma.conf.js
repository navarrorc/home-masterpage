var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');

module.exports = function (config) {    
    config.set({

        basePath: '',

        frameworks: ['mocha', 'chai'],

        files: [  
            'test/lib/jquery.min.js',
            'test/lib/react.js',
            'test/lib/lodash.js',
            'test/lib/q.js',                    
            'test/lib/sinon.js',
            'test/lib/SharePoint_Globals.js',                   
            'test/test_index.js'            
        ],
        
        client: {
          mocha: {
            reporter: 'html'            
          }
        },
        
      	preprocessors: {
          // add preprocessors 
			    //'**/*.ts?(x)': ['webpack', 'sourcemap']
          'test/test_index.js': ['webpack', 'sourcemap']			    
		    },
        
        // babelPreprocessor: {
        //   options: {
        //     presets: ['es2015'],
        //     sourceMap: 'inline'
        //   }
        // },
        
        webpack: {
          // webpack configuration  
          // cache: true,
          // context: path.resolve('./test'),
          // output: {
          //   //path: path.resolve('./test'),
          //   filename: 'bundle.js'
          // },
          resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json']
          },        
          //devtool: 'eval-source-map',
          devtool: 'inline-source-map',          
          module: {
            loaders: [
              { 
                test: /\.json$/, 
                exclude: node_modules_dir,                
                loader: 'json-loader' },    
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
        reporters: ['mocha', 'coverage'],
        
        coverageReporter: {
          dir: 'coverage/',
          reporters: [
            { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
            { type: 'html', subdir: 'html' }
          ]
        },
        
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
        browsers: ['PhantomJS', 'Chrome'],
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