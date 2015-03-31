'use strict';
let Reflux = require('reflux');
let { JobOfferSignedActions } = require('../actions');

let JobOfferSignedStore = Reflux.createStore({
  listenables: JobOfferSignedActions,
  permission: true,

  init () {
    this.data = [
      { id: 'true', name: 'All Signed', value: '1' },
      { id: 'false', name: 'Any Unsigned', value: '1' }
    ];
  }
});

module.exports = JobOfferSignedStore;
