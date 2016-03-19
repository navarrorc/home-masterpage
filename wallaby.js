// Wallaby.js configuration

var wallabyWebpack = require('wallaby-webpack');
var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');
var babel = require('babel-core');

var wallabyPostprocessor = wallabyWebpack({  
  // entry: {
  //   app: './test/sequenceTests.ts'
  // },
  // module: {
  //   loaders: [
  //     { test: /\.json$/, loader: 'json-loader' },
  //     { 
  //       test: /\.ts$/,
  //       include: [
  //         path.resolve(__dirname, './test')
  //       ], 
  //       exclude: node_modules_dir,
  //       loader: 'ts-loader' 
  //     }
  //   ]
  // },
  // node: {
  //   fs: 'empty'  
  // }
  // node: {
  //   console: true,
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  //   child_process: 'empty'
  // }
})

module.exports = function (w) {
  return {
    files: [
      {"pattern": "test/lib/jquery.min.js", "instrument": false},
      {"pattern": "test/lib/chai.js", "instrument": false},
      {"pattern": "test/lib/chai-as-promised.js", "instrument": false},
      {"pattern": "test/lib/q.js", "instrument": false},
      {"pattern": "test/lib/sinon.js", "instrument": false},
      
      
      {"pattern": "src/app/**/*.ts", load: false},
      {"pattern": "test/sut/**/*.ts", load: false}
      //{"pattern": "test/sut/*.js", load: true},      
      //{"pattern": "test/data/*.json", load: true}      
    ],

    tests: [      
      //{"pattern": "test/*Tests.ts", load: false},      
      // {"pattern": "test/*Tests.js", load: false},      
      //{"pattern": "test/*spec.ts", load: false},      
      {"pattern": "test/**/*Tests.ts", load: false}      
    ],
    
    debug: false,
    
    postprocessor: wallabyPostprocessor,
    
    "testFramework": "mocha",
    
    setup: function () {
      // required to trigger test loadinge
      window.__moduleBundler.loadTests();
      
      // configure the test framework
      // var mocha = wallaby.testFramework;
      // mocha.ui('bdd');
      // mocha.ignoreLeaks(true);
      // mocha.globals(['_spPageContextInfo', '$']);
    },   

    compilers: {
      '**/*.ts?(x)': w.compilers.typeScript({
        module:'commonjs', 
        allowJs:true
      })
      // ,
      // '**/*.js': w.compilers.babel({
      //   babel: babel,        
      //   presets: ['es2015']
      // })
    },
    
    // for node.js tests you need to set env property as well
    // http://wallabyjs.com/docs/integration/node.html
    env: {
  //    type: 'node'  
  //    params: {
  //        runner: '--harmony --harmony_arrow_functions'
  //    }    
      type: 'browser',
      runner: 'C:/Users/navarrorc/Downloads/phantomjs-2.1.1/bin/phantomjs.exe',
      params: { runner: '--web-security=false'}
    }
    
    
  };
};
