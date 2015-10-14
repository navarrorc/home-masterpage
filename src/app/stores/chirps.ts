import {constants} from '../constants';
//import {extend} from './store';
import store = require('./store');

//export var ChirpStore = extend({
var ChirpStore = exports = store.extend({
  init: function () {
    this.bind(constants.GOT_CHIRPS, this.set);
    this.bind(constants.CHIRPED, this.add);
  }
});
