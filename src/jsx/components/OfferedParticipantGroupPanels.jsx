var OfferedParticipantGroupPanels = React.createClass({
  mixins: [
    Reflux.connect(OfferedParticipantGroupStore, "offeredParticipantGroups"),
    Reflux.connect(ProgramStore, "programs"),
    RenderLoadedMixin(["offeredParticipantGroups", "programs"])
  ],

  getInitialState: function () {
    return {};
  },

  componentDidMount: function() {
    window.RESOURCE_URLS = this.props.urls; /* TODO: I hate that you have to do this. */
    EmployerActions.setSingleton();
    StaffActions.setSingleton();
    OfferedParticipantGroupActions.ajaxLoad();
    PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      <div id="offered-participant-group-panels">
        {this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
          return <OfferedParticipantGroupPanel
                  offeredParticipantGroup={offeredParticipantGroup}
                  key={"offered-participant-proup-"+offeredParticipantGroup.id} />;
        })}
      </div>
    )
  }
});
