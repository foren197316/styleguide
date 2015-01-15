var AwaitingOrdersParticipantGroupPanel = React.createClass({displayName: 'AwaitingOrdersParticipantGroupPanel',
  getInitialState: function() {
    return {
      sending: false,
      puttingInMatching: false,
      puttingOnReserve: false
    };
  },

  handlePutInMatching: function (event) {
    this.setState({ puttingInMatching: true });
  },

  handlePutOnReserve: function (event) {
    this.setState({ puttingOnReserve: true });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReserve: false, puttingInMatching: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        url = null,
        data = null;

    if (this.state.puttingInMatching) {
      url = "/in_matching_participant_groups.json";
      data = {
        in_matching_participant_group: {
          awaiting_orders_participant_group_id: this.props.data.id
        }
      };
    } else if (this.state.puttingOnReserve) {
      url = "/reserved_participant_groups.json";
      data = {
        reserved_participant_group: {
          awaiting_orders_participant_group_id: this.props.data.id
        }
      };
    }

    $.ajax({
      url: url,
      type: "POST",
      data: data,
      success: function(data) {
        React.unmountComponentAtNode(node);
        $(node).remove();
      },
      error: function(data) {
        window.location = window.location;
      }
    });
  },

  render: function() {
    var actions,
        footerName = this.props.data.name + (this.props.data.program != undefined ? " - " + this.props.data.program.name : ""),
        participantNodes = this.props.data.participants.map(function (participant) {
          return (
            ParticipantGroupParticipant({key: participant.id, data: participant})
          )
        });

    if (this.state.puttingInMatching || this.state.puttingOnReserve) {
      actions = (
        React.DOM.div({className: "btn-group"},
          React.DOM.button({className: "btn btn-success", onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, "Confirm"),
          React.DOM.button({className: "btn btn-default", onClick: this.handleCancel}, "Cancel")
        )
      )
    } else {
      actions = (
        React.DOM.div({className: "btn-group"},
          React.DOM.button({className: "btn btn-primary", onClick: this.handlePutInMatching}, "Put In Matching"),
          React.DOM.button({className: "btn btn-warning", onClick: this.handlePutOnReserve}, "Put On Reserve")
        )
      )
    }

    return (
      React.DOM.div({className: "panel panel-default participant-group-panel"},
        React.DOM.div({className: "list-group"},
          participantNodes
        ),
        ParticipantGroupPanelFooter({name: footerName},
          actions
        )
      )
    )
  }
});

var AwaitingOrdersParticipantGroupPanels = React.createClass({displayName: 'AwaitingOrdersParticipantGroupPanels',
  mixins: [GroupPanelsMixin],
  resourceName: "awaiting_orders_participant_groups",
  participantGroupPanelType: AwaitingOrdersParticipantGroupPanel
});
