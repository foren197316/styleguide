/* @flow */
'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var SetUrlsMixin = require('../mixins').SetUrlsMixin;
var RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
var JobListingStore = require('../stores/JobListingStore');
var JobListing = require('./JobListing');
var JobListingActions = require('../actions').JobListingActions;
var Pagination = require('./Pagination');
var ReloadingComponent = require('./ReloadingComponent');
var query = require('../query');

var JobListingsIndex = React.createClass({displayName: 'JobListingsIndex',
  mixins: [
    SetUrlsMixin,
    React.addons.LinkedStateMixin,
    Reflux.connect(JobListingStore, 'jobListings'),
    RenderLoadedMixin('jobListings')
  ],

  getInitialState: function () {
    return { formSending: false };
  },

  componentDidMount: function () {
    JobListingActions.ajaxSearch(query.getQuery());
  },

  renderLoaded: function () {
    var pageCount = JobListingStore.meta.pageCount;
    var recordCount = JobListingStore.meta.recordCount;
    var page = query.getCurrentPage();
    var formSendingLink = this.linkState('formSending');
    var recordName = 'Job Listings';

    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-xs-12 col-md-3'}),
        React.DOM.div({className: 'col-xs-12 col-md-9'},
          React.createElement(ReloadingComponent, {loadingLink: formSendingLink},
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12'},
                React.createElement(Pagination, { pageCount: pageCount, recordCount: recordCount, page: page, actions: JobListingActions, formSending: formSendingLink, recordName: recordName })
              )
            ),
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12'},
                this.state.jobListings.map(function (jobListing, index) {
                  return React.createElement(JobListing, {jobListing: jobListing, key: 'jobListing-' + index});
                }, this)
              )
            ),
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12'},
                React.createElement(Pagination, { pageCount: pageCount, recordCount: recordCount, page: page, actions: JobListingActions, formSending: formSendingLink, recordName: recordName })
              )
            )
          )
        )
      )
    );
  }
});

module.exports = JobListingsIndex;
