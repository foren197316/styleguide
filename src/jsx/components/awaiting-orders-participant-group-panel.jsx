var AwaitingOrdersParticipantGroupPanel = React.createClass({
  render: function () {
    return (
      <div>LOL</div>
    )
  }
});

var AwaitingOrdersParticipantGroupPanels = React.createClass({
  mixins: [GroupPanelsMixin],
  resourceName: "awaiting_orders_participant_groups",
  participantGroupPanelType: AwaitingOrdersParticipantGroupPanel
});
