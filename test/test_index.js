// test/test_index.js

// require all modules ending in "_spec" from the
// current directory and all subdirectories
var testsContext = require.context(".", true, /.spec$/);
testsContext.keys().forEach(testsContext);