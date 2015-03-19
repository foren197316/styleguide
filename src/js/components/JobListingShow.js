/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let JobListingActions = require('../actions').JobListingActions;
let JobListingDetails = require('./JobListingDetails');
let SetUrlsMixin = require('../mixins').SetUrlsMixin;
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;

let JobListingStore = require('../stores/JobListingStore');
let MetaStore = require('../stores/MetaStore');

module.exports = React.createClass({displayName: 'JobListingDetails',
  mixins: [
    SetUrlsMixin,
    Reflux.connect(JobListingStore, 'jobListing'),
    Reflux.connect(MetaStore, 'meta'),
    RenderLoadedMixin('jobListing', 'meta')
  ],

  componentDidMount: function () {
    JobListingActions.ajaxLoadSingleton();
  },

  renderLoaded: function () {
    return React.DOM.div({}, React.createElement(JobListingDetails, {jobListing: this.state.jobListing, meta: this.state.meta}));
  }
});
