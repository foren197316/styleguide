/* @flow */
'use strict';

var React = require('react/addons');
var currency = require('../currency');

var JobListing = React.createClass({displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    var jobListing = this.props.jobListing;
    var href = '/job_listings/' + this.props.jobListing.id;

    return (
      React.DOM.a({href: href, className: 'list-group-item clearfix'},
        React.DOM.div({className: 'col-xs-12 col-md-4'}, React.DOM.strong(null, jobListing.position_name)),
        React.DOM.div({className: 'col-xs-12 col-md-2'}, currency(jobListing.wage) + '/hour'),
        React.DOM.div({className: 'col-xs-12 col-md-3'}, jobListing.employer_type_name),
        React.DOM.div({className: 'col-xs-12 col-md-3'}, jobListing.employer_region_name)
      )
    );
  }
});

module.exports = JobListing;
