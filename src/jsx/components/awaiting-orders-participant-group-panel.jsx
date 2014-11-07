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
    var actionRow,
        participantNodes = this.props.data.participants.map(function (participant) {
          return (
            <ParticipantGroupParticipant key={participant.id} data={participant} />
          )
        });

    if (this.state.puttingInMatching || this.state.puttingOnReserve) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
            <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
          </div>
        </div>
      </div>;
    } else {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-primary" onClick={this.handlePutInMatching}>Put In Matching</button>
            <button className="btn btn-warning" onClick={this.handlePutOnReserve}>Put On Reserve</button>
          </div>
        </div>
      </div>;
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {participantNodes}
        </div>
        <div className="panel-footer clearfix">
          {actionRow}
        </div>
      </div>
    )
  }
});

var AwaitingOrdersParticipantGroupPanels = React.createClass({
  mixins: [GroupPanelsMixin],
  resourceName: "awaiting_orders_participant_groups",
  participantGroupPanelType: AwaitingOrdersParticipantGroupPanel
});
