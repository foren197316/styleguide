var AwaitingOrdersParticipantGroupPanel = React.createClass({
  render: function() {
    var participantNodes = this.props.data.participants.map(function (participant) {
        return (
          <ParticipantGroupParticipant key={participant.id} data={participant} />
        )
      });

    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {participantNodes}
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
