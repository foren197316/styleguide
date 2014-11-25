var AwaitingOrdersParticipantGroupPanel = React.createClass({
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
            <ParticipantGroupParticipant key={participant.id} data={participant} />
          )
        });

    if (this.state.puttingInMatching || this.state.puttingOnReserve) {
      actions = (
        <div className="btn-group">
          <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
        </div>
      )
    } else {
      actions = (
        <div className="btn-group">
          <button className="btn btn-primary" onClick={this.handlePutInMatching}>Put In Matching</button>
          <button className="btn btn-warning" onClick={this.handlePutOnReserve}>Put On Reserve</button>
        </div>
      )
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {participantNodes}
        </div>
        <ParticipantGroupPanelFooter name={footerName}>
          {actions}
        </ParticipantGroupPanelFooter>
      </div>
    )
  }
});

var AwaitingOrdersParticipantGroupPanels = React.createClass({
  mixins: [GroupPanelsMixin],
  resourceName: "awaiting_orders_participant_groups",
  participantGroupPanelType: AwaitingOrdersParticipantGroupPanel
});
