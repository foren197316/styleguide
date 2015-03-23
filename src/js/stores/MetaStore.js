/* @flow */
'use strict';

let Reflux = require('reflux');

let MetaStore = Reflux.createStore({
  set (meta) {
    if (meta == null) {
      return;
    }

    if (this.data != null) {
      this.mergeData(meta);
    } else {
      this.data = meta;
    }

    this.trigger(this.data);
  },

  setAttribute (attribute, value) {
    this.data[attribute] = value;
    this.trigger(this.data);
  },

  mergeData (newData) {
    Object.keys(newData).forEach(key => {
      this.data[key] = newData[key];
    });
  }
});

module.exports = MetaStore;
