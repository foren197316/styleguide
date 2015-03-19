/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let SetUrlsMixin = require('../mixins').SetUrlsMixin;
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;
let JobListing = require('./JobListing');
let JobListingActions = require('../actions').JobListingActions;
let Pagination = require('./Pagination');
let ReloadingComponent = require('./ReloadingComponent');
let query = require('../query');
let { div } = React.DOM;

let JobListingStore = require('../stores/JobListingStore');
let MetaStore = require('../stores/MetaStore');

var JobListingsIndex = React.createClass({displayName: 'JobListingsIndex',
  mixins: [
    SetUrlsMixin,
    React.addons.LinkedStateMixin,
    Reflux.connect(JobListingStore, 'jobListings'),
    Reflux.connect(MetaStore, 'meta'),
    RenderLoadedMixin('jobListings', 'meta')
  ],

  getInitialState: function () {
    return { formSending: false };
  },

  componentDidMount: function () {
    JobListingActions.ajaxSearch(query.getQuery());
  },

  renderLoaded: function () {
    let pageCount = this.state.meta.pageCount;
    let recordCount = this.state.meta.recordCount;
    let page = query.getCurrentPage();
    let formSendingLink = this.linkState('formSending');
    let recordName = 'Job Listings';

    return (
      div({className: 'row'},
        div({className: 'col-xs-12 col-md-3'}),
        div({className: 'col-xs-12 col-md-9'},
          React.createElement(ReloadingComponent, {loadingLink: formSendingLink},
            div({className: 'row'},
              div({className: 'col-xs-12'},
                React.createElement(Pagination, { pageCount: pageCount, recordCount: recordCount, page: page, actions: JobListingActions, formSending: formSendingLink, recordName: recordName })
              )
            ),
            div({className: 'row'},
              div({className: 'col-xs-12'},
                this.state.jobListings.map((jobListing, index) => (
                  React.createElement(JobListing, {jobListing: jobListing, meta: this.state.meta, key: `jobListing-${index}`})
                ))
              )
            ),
            div({className: 'row'},
              div({className: 'col-xs-12'},
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
