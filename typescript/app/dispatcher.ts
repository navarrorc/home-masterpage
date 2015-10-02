import flux = require('flux');

export var dispatcher = new flux.Dispatcher();

dispatcher.register((action)=>{
  console.info(action);
});
