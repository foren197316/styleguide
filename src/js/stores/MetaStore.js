/* @flow */
'use strict';

let Reflux = require('reflux');

let MetaStore = Reflux.createStore({
  set (meta) {
    console.log(meta);
    this.data = meta;
    this.trigger(this.data);
  },

  setAttribute (attribute, value) {
    this.data[attribute] = value;
    this.trigger(this.data);
  }
});

module.exports = MetaStore;
