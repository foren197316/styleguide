/* @flow */
'use strict';

var Reflux = require('reflux');
var JobListingActions = require('../actions').JobListingActions;

module.exports = Reflux.createStore({
  resourceName: 'jobListings',
  listenables: JobListingActions
});
