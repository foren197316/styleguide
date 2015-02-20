/* @flow */
'use strict';

var React = require('react/addons');
var JobListing = require('./JobListing');
var currency = require('../currency');

module.exports = React.createClass({displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    var jobListing = this.props.jobListing;

    return (
      JobListing({jobListing: jobListing},
        React.DOM.div({className: 'panel-footer clearfix'},
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.openings + ' Position'.pluralize(jobListing.openings) + ' Available'),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.site_city + ', ' + jobListing.site_state),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, (jobListing.has_tips === 'true' ? 'Tipped' : 'Not Tipped')),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.hours + ' hours per week'),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.housing_type),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.housing_description),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, currency(jobListing.housing_deposit)),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, currency(jobListing.housing_rent) + '/week'),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.employer_cultural_opportunites),
          React.DOM.div({className: 'col-xs-12 col-md-4'}, '#' + jobListing.id)
        )
      )
    );
  }
});
