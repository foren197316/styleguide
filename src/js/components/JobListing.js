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
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.position_name),
          React.DOM.div({className: 'col-xs-12 col-md-2'}, currency(jobListing.wage) + '/hour'),
          React.DOM.div({className: 'col-xs-12 col-md-3'}, jobListing.employer_type_name),
          React.DOM.div({className: 'col-xs-12 col-md-3'}, jobListing.employer_region_name)
        ),
        React.DOM.div({className: 'panel-footer clearfix'},
          React.DOM.div({className: 'col-xs-12 col-md-4'}, jobListing.openings + ' Positions Available'),
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

module.exports = JobListing;
