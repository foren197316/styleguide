/* @flow */
'use strict';
let Reflux = require('reflux');

let MetaStore = Reflux.createStore({
  set (data) {
    if (data == null) {
      return;
    }

    this.mergeData(data);

    this.trigger(this.data);
  },

  setAttribute (attribute, value) {
    this.data[attribute] = value;
    this.trigger(this.data);
  },

  mergeData (data) {
    if (this.data == null) {
      this.data = data;
    } else {
      Object.keys(data).forEach(key => {
        this.data[key] = data[key];
      });
    }
  }
});

module.exports = MetaStore;
