/* @flow */
'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var SetUrlsMixin = require('../mixins').SetUrlsMixin;
var RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
var JobListingStore = require('../stores/JobListingStore');
var JobListing = require('./JobListing');
var actions = require('../actions');

var JobListingsIndex = React.createClass({displayName: 'JobListingsIndex',
  mixins: [
    SetUrlsMixin,
    Reflux.connect(JobListingStore, 'jobListings'),
    RenderLoadedMixin('jobListings')
  ],

  componentDidMount: function () {
    actions.JobListingActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'}),
        React.DOM.div({className: 'col-md-9'},
          React.DOM.div(null,
            this.state.jobListings.map(function (jobListing) {
              return JobListing({jobListing: jobListing});
            })
          )
        )
      )
    );
  }
});

module.exports = JobListingsIndex;
