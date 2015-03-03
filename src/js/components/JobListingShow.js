/* @flow */
'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var JobListingStore = require('../stores/JobListingStore');
var JobListingActions = require('../actions').JobListingActions;
var JobListingDetails = require('./JobListingDetails');
var SetUrlsMixin = require('../mixins').SetUrlsMixin;
var RenderLoadedMixin = require('../mixins').RenderLoadedMixin;

module.exports = React.createClass({displayName: 'JobListingDetails',
  mixins: [
    SetUrlsMixin,
    Reflux.connect(JobListingStore, 'jobListing'),
    RenderLoadedMixin('jobListing')
  ],

  componentDidMount: function () {
    JobListingActions.ajaxLoadSingleton();
  },

  renderLoaded: function () {
    return React.DOM.div({}, React.createElement(JobListingDetails, {jobListing: this.state.jobListing}));
  }
});
