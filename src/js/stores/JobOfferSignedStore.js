'use strict';
let Reflux = require('reflux');
let JobOfferSignedActions = require('../actions').JobOfferSignedActions;

let JobOfferSignedStore = Reflux.createStore({
  listenables: JobOfferSignedActions,
  permission: true,

  init () {
    this.data = [
      { id: 'All Signed', name: 'All Signed' },
      { id: 'Any Unsigned', name: 'Any Unsigned' }
    ];
  }
});

module.exports = JobOfferSignedStore;
