/* @flow */
'use strict';

var React = require('react/addons');
var currency = require('../currency');

var JobListing = React.createClass({displayName: 'JobListing',
  propTypes: {
    jobListing: React.PropTypes.object.isRequired,
    linkMethod: React.PropTypes.func
  },

  render: function () {
    var jobListing = this.props.jobListing;
    var linkAttributes = { href: '/job_listings/' + this.props.jobListing.id };

    if (this.props.linkMethod) {
      linkAttributes.onClick = this.props.linkMethod;
    }

    return (
      React.DOM.div({className: 'panel panel-default'},
        React.DOM.div({className: 'panel-body'},
          React.DOM.div({className: 'col-xs-12 col-md-4'},
            React.DOM.a(linkAttributes, React.DOM.strong(null, jobListing.position_name))
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
