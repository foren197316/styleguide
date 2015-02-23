/* @flow */
'use strict';

var React = require('react/addons');
var currency = require('../currency');

module.exports = React.createClass({displayName: 'JobListingDetails',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    var jobListing = this.props.jobListing;

    return (
      React.DOM.div({className: 'panel panel-default'},
        React.DOM.div({className: 'panel-body clearfix'},
          React.DOM.h1(null, jobListing.position_name, ' ', React.DOM.small(null, currency(jobListing.wage), '/hour')),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, React.DOM.hr(null)),
          React.DOM.h3(null, 'Location ', React.DOM.small(null, jobListing.employer_region_name)),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, jobListing.site_city + ', ' + jobListing.site_state),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, React.DOM.hr(null)),
          React.DOM.h3(null, 'Details ', React.DOM.small(null, jobListing.employer_type_name)),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, jobListing.openings + ' Position'.pluralize(jobListing.openings) + ' Available'),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, (jobListing.has_tips === 'true' ? 'Tipped' : 'Not Tipped')),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, jobListing.hours + ' hours per week'),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, React.DOM.hr(null)),
          React.DOM.h3(null,
            'Housing ',
            React.DOM.small(null, jobListing.housing_type)
          ),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, jobListing.housing_description),
          (function() {
            if (jobListing.housing_type === 'Provided') {
              return React.DOM.div({className: 'col-xs-12 col-md-12'},
                React.DOM.br(null),
                React.DOM.div(null, currency(jobListing.housing_deposit) + ' deposit'),
                React.DOM.div(null, currency(jobListing.housing_rent) + '/week')
              );
            }
          })(),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, React.DOM.hr(null)),
          React.DOM.h3(null, 'Cultural Opportunities'),
          React.DOM.div({className: 'col-xs-12 col-md-12'}, jobListing.employer_cultural_opportunites)
        ),
        React.DOM.div({className: 'panel-footer clearfix'},
          React.DOM.a({href: '/job_listings/' + jobListing.id},
            React.DOM.strong(null, 'Job Listing #' + jobListing.id)
          )
        )
      )
    );
  }
});
