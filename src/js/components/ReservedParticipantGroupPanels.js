'use strict';

var React = require('react/addons');
var dateFormatMDY = require('../globals').dateFormatMDY;
var Spinner = require('./Spinner');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var moment = require('moment');

var ReservedParticipantGroupPanel = React.createClass({displayName: 'ReservedParticipantGroupPanel',
  propTypes: {
    data: React.PropTypes.object.isRequired,
    employerId: React.PropTypes.number
  },

  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = moment().add(3, 'days').format(dateFormatMDY);
  },

  handlePutOnReview: function() {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function() {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function() {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            employer_id: this.props.employerId,
            expires_on: this.props.onReviewExpiresOn,
            reserved_participant_group_id: this.props.data.id
          }
        };

    $.ajax({
      url: '/on_review_participant_groups.json',
      type: 'POST',
      data: data,
      success: function() {
        React.unmountComponentAtNode(node);
        $(node).remove();
      },
      error: function() {
        global.location = global.location;
      }
    });
  },

  render: function() {
    var actions,
        additionalContent,
        footerName = this.props.data.name,
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant',
        participantNodes = this.props.data.participants.map(function (participant) {
          return ParticipantGroupParticipant({key: participant.id, participant: participant});
        });

    if (this.state.puttingOnReview) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );

      additionalContent = (
        React.DOM.div(null,
          React.DOM.p({className: 'panel-text'}, 'You will have until ', React.DOM.strong(null, this.props.onReviewExpiresOn), ' to offer a position or decline the ', participantPluralized, '.'),
          React.DOM.p({className: 'panel-text'}, 'If you take no action by ', React.DOM.strong(null, this.props.onReviewExpiresOn), ', the ', participantPluralized, ' will automatically be removed from your On Review list.')
        )
      );
    } else {
      actions = (
        React.DOM.button({className: 'btn btn-success', onClick: this.handlePutOnReview}, 'Put on Review')
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.DOM.div({className: 'list-group'},
          participantNodes
        ),
        ParticipantGroupPanelFooter({name: footerName},
          actions,
          additionalContent
        )
      )
    );
  }
});

var ReservedParticipantGroupPanels = React.createClass({displayName: 'ReservedParticipantGroupPanels',
  propTypes: {
    source: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      groups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data.reserved_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId;

      return (
        React.DOM.div({id: 'participant-group-panels'},
          this.state.groups.map(function (group) {
            return ReservedParticipantGroupPanel({key: group.id, data: group, employerId: employerId});
          })
        )
      );
    } else {
      return Spinner(null);
    }
  }
});

module.exports = ReservedParticipantGroupPanels;
