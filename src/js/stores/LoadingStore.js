'use strict';
let Reflux = require('reflux');

let isLoading = false;

let LoadingStore = Reflux.createStore({
  setTrue () {
    isLoading = true;
    this.trigger(isLoading);
  },

  setFalse () {
    isLoading = false;
    this.trigger(isLoading);
  }
});

module.exports = LoadingStore;
