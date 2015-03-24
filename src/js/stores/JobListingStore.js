/* @flow */
'use strict';

let Reflux = require('reflux');
let JobListingActions = require('../actions').JobListingActions;

module.exports = Reflux.createStore({
  resourceName: 'jobListings',
  listenables: JobListingActions
});
