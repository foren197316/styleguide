var AwaitingOrdersParticipantGroupPanel = React.createClass({
  getInitialState: function() {
    return { puttingInMatching: false };
  },

  handlePutInMatching: function (event) {
    this.setState({ sending: false, puttingInMatching: true });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          in_matching_participant_group: {
            awaiting_orders_participant_group_id: this.props.data.id
          }
        };

    $.ajax({
      url: "/in_matching_participant_groups.json",
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

    if (this.state.puttingInMatching) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          </div>
        </div>
      </div>;
    } else {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <button className="btn btn-primary pull-right" onClick={this.handlePutInMatching}>Put In Matching</button>
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
