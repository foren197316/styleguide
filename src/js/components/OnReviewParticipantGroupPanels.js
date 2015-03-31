/* @flow */
'use strict';

let React = require('react/addons');
let OnReviewParticipantGroupPanel = React.createFactory(require('./OnReviewParticipantGroupPanel'));
let Spinner = React.createFactory(require('./Spinner'));
let $ = require('jquery');

let OnReviewParticipantGroupPanels = React.createClass({displayName: 'OnReviewParticipantGroupPanels',
  propTypes: {
    source: React.PropTypes.string.isRequired,
    employerId: React.PropTypes.string.isRequired,
    employerName: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return { groups: [] };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data.on_review_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      let employerId = this.props.employerId;
      let employerName = this.props.employerName;
      let groups = this.state.groups;

      return (
        React.DOM.div({id: 'participant-group-panels'},
          groups.map((group) => (
            OnReviewParticipantGroupPanel({key: group.id, data: group, employerId: employerId, employerName: employerName})
          ))
        )
      );
    } else {
      return Spinner();
    }
  }
});

module.exports = OnReviewParticipantGroupPanels;
