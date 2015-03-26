/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let JobListingDetails = require('./JobListingDetails');
let RenderLoadedMixin = require('../mixins').RenderLoadedMixin;

let initialData = (global.INITIAL_DATA || {});
let {
  job_listing:initialJobListing,
  meta:initialMeta,
  employer:initialEmployer
} = initialData;

let JobListingStore = require('../stores/JobListingStore');
let EmployerStore = require('../stores/EmployerStore');
let MetaStore = require('../stores/MetaStore');

module.exports = React.createClass({displayName: 'JobListingDetails',
  mixins: [
    Reflux.connect(JobListingStore, 'jobListing'),
    Reflux.connect(EmployerStore, 'employer'),
    Reflux.connect(MetaStore, 'meta'),
    RenderLoadedMixin('jobListing', 'employer', 'meta')
  ],

  componentDidMount () {
    JobListingStore.set(initialJobListing);
    EmployerStore.set(initialEmployer);
    MetaStore.set(initialMeta);
  },

  renderLoaded () {
    let jobListing = this.state.jobListing;
    let employer = this.state.employer;
    let meta = this.state.meta;

    return React.DOM.div({}, React.createElement(JobListingDetails, {jobListing, employer, meta}));
  }
});
