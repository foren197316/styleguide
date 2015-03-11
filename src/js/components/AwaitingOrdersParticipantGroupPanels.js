/* @flow */
'use strict';

var React = require('react/addons');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var Spinner = require('./Spinner');
var $ = require('jquery');

var AwaitingOrdersParticipantGroupPanel = React.createClass({displayName: 'AwaitingOrdersParticipantGroupPanel',
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      sending: false,
      puttingInMatching: false,
      puttingOnReserve: false
    };
  },

  handlePutInMatching: function () {
    this.setState({ puttingInMatching: true });
  },

  handlePutOnReserve: function () {
    this.setState({ puttingOnReserve: true });
  },

  handleCancel: function() {
    this.setState({ puttingOnReserve: false, puttingInMatching: false });
  },

  handleConfirm: function() {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        url = null,
        data = null;

    if (this.state.puttingInMatching) {
      url = '/in_matching_participant_groups.json';
      data = {
        in_matching_participant_group: {
          awaiting_orders_participant_group_id: this.props.data.id
        }
      };
    } else if (this.state.puttingOnReserve) {
      url = '/reserved_participant_groups.json';
      data = {
        reserved_participant_group: {
          awaiting_orders_participant_group_id: this.props.data.id
        }
      };
    }

    $.ajax({
      url: url,
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
        footerName = this.props.data.name + (this.props.data.program != null ? ' - ' + this.props.data.program.name : ''),
        participantNodes = this.props.data.participants.map(function (participant) {
          return React.createElement(ParticipantGroupParticipant, {key: participant.id, participant: participant});
        });

    if (this.state.puttingInMatching || this.state.puttingOnReserve) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-primary', onClick: this.handlePutInMatching}, 'Put In Matching'),
          React.DOM.button({className: 'btn btn-warning', onClick: this.handlePutOnReserve}, 'Put On Reserve')
        )
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.DOM.div({className: 'list-group'},
          participantNodes
        ),
        React.createElement(ParticipantGroupPanelFooter, {name: footerName},
          actions
        )
      )
    );
  }
});

var AwaitingOrdersParticipantGroupPanels = React.createClass({displayName: 'AwaitingOrdersParticipantGroupPanels',
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
          groups: data.awaiting_orders_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      return (
        React.DOM.div({id: 'participant-group-panels'},
          this.state.groups.map(function (group) {
            return React.createElement(AwaitingOrdersParticipantGroupPanel, {key: group.id, data: group});
          })
        )
      );
    } else {
      return React.createElement(Spinner, {});
    }
  }
});

module.exports = AwaitingOrdersParticipantGroupPanels;
