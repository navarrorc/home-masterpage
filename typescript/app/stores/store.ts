import assign = require('object-assign');
import {EventEmitter} from 'events';
import {dispatcher} from '../dispatcher';

var EventEmitterProto = EventEmitter.prototype;
var CHANGE_EVENT = 'CHANGE';

var storeMethods = {
  init: function() {},
  set: function (arr:any) {
    //var currIds = this._data.map((m:any)=>{return m.cid;});

    // arr.filter((item:any)=>{
    //   return currIds.indexOf(item.cid) === -1;
    // }).forEach(this.add.bind(this));

    console.info('Data set');
    console.info('arr', arr);
    console.info(this._data);
  },
  add: function(item:any) {
    this._data.push(item);
  },
  all: function() {
    return this._data;
  },
  get: function(id:any) {
    return this._data.filter((item:any)=>{
      return item.cid === id;
    })[0];
  },
  addChangeListener: function(fn:any) {
    this.on(CHANGE_EVENT, fn);
  },
  removeChangeListener: function(fn:any) {
    this.removeListener(CHANGE_EVENT, fn);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  bind: function(actionType:any, actionFn:any) {
    if(this.actions[actionType]) {
     this.actions[actionType].push(actionFn);
   } else {
      this.actions[actionType] = [actionFn];
   }
  }

};

export var extend = (methods:any) => {
  var store = {
    init: function(){},
    _data: [],
    actions: {}
  };

  assign(store, EventEmitterProto, storeMethods, methods);
  store.init();
  //storeMethods.init();

  dispatcher.register((action: any)=>{
    if (store.actions[action.actionType]) {
      store.actions[action.actionType].forEach((fn:any)=>{
        fn.call(store, action.data);
      });
    }
  });

  return store;

};
