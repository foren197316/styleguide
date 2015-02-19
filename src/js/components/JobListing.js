/* @flow */
'use strict';

var React = require('react/addons');
var currency = require('../currency');

var JobListing = React.createClass({displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.DOM.div({className: 'panel-body'},
          React.DOM.div({className: 'col-xs-12 col-md-4'}, this.props.jobListing.position_name),
          React.DOM.div({className: 'col-xs-12 col-md-2'}, currency(this.props.jobListing.wage) + '/hour'),
          React.DOM.div({className: 'col-xs-12 col-md-3'}, this.props.jobListing.employer_type_name),
          React.DOM.div({className: 'col-xs-12 col-md-3'}, this.props.jobListing.employer_region_name)
        )
      )
    );
  }
});

module.exports = JobListing;
