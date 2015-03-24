/* @flow */
'use strict';

let Reflux = require('reflux');
let JobListingActions = require('../actions').JobListingActions;

let JobListingStore = Reflux.createStore({
  resourceName: 'jobListings',
  listenables: JobListingActions,

  set (data) {
    if (data == null) {
      return;
    }

    this.mergeData(data);

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

module.exports = JobListingStore;
