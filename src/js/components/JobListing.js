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

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.DOM.div({className: 'panel-body'},
          React.DOM.div({className: 'col-xs-12 col-md-4'},
            React.DOM.a({ href: '/job_listings/' + jobListing.id }, jobListing.position_name)
          ),
          React.DOM.div({className: 'col-xs-12 col-md-2'}, currency(jobListing.wage) + '/hour'),
          React.DOM.div({className: 'col-xs-12 col-md-3'}, jobListing.employer_type_name),
          React.DOM.div({className: 'col-xs-12 col-md-3'}, jobListing.employer_region_name)
        ),
        this.props.children
      )
    );
  }
});

module.exports = JobListing;
