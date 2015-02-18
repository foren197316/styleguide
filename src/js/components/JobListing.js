/* @flow */
'use strict';

var React = require('react/addons');

var JobListing = React.createClass({displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-xs-12 col-md-1'}, this.props.jobListing.id),
        React.DOM.div({className: 'col-xs-12 col-md-3'}, this.props.jobListing.position_name),
        React.DOM.div({className: 'col-xs-12 col-md-3'}, this.props.jobListing.employer_type_name)
      )
    );
  }
});

module.exports = JobListing;
