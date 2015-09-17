module.exports = function (wallaby) {
  return {
    files: [
      {"pattern": "builds/development/lib/jquery.min.js", "instrument": false},
      {"pattern": "typescript/test/lib/*.js", "instrument": false},
      "typescript/*.ts",
      "typescript/templates/*.ts"
    ],

    tests: [
      "typescript/test/*Tests.ts",
    ],
    "testFramework": "mocha"
    // for node.js tests you need to set env property as well
    // http://wallabyjs.com/docs/integration/node.html
  };
};
