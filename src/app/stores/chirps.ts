import {constants} from '../Constants';
//import {extend} from './store';
import store = require('./Store');

//export var ChirpStore = extend({
var ChirpStore = exports = store.extend({
  init: function () {
    this.bind(constants.GOT_CHIRPS, this.set);
    this.bind(constants.CHIRPED, this.add);
  }
});
