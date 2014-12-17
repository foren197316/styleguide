var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [Reflux.ListenerMixin, Reflux.connect(OfferedParticipantGroupStore, "offeredParticipantGroups")],

  getInitialState: function () {
    return { offeredParticipantGroups: null };
  },

  componentDidMount: function() {
    window.RESOURCE_URLS = this.props.urls;
    OfferedParticipantGroupActions.ajaxLoad();
    PositionActions.ajaxLoad();
  },

  render: function () {
    if (this.state.offeredParticipantGroups) {
      return this.renderLoaded();
    } else {
      return <Spinner />
    }
  },

  renderLoaded: function () {
    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="offered_names" searchOn={["participant_names", "participant_emails", "participant_uuids"]} store={OfferedParticipantGroupStore} actions={OfferedParticipantGroupActions} />
          <CheckBoxFilter title="Program" store={ProgramStore} actions={ProgramActions} />
          <CheckBoxFilter title="Participant Agreement" store={ParticipantSignedStore} actions={ParticipantSignedActions} />
          <CheckBoxFilter title="Offer Sent" store={OfferSentStore} actions={OfferSentActions} />
          <CheckBoxFilter title="Coordinator" store={StaffStore} actions={StaffActions} />
          <CheckBoxFilter title="Employer" store={EmployerStore} actions={EmployerActions} />
        </div>
        <div className="col-md-9">
          <div id="participant-group-panels">
            {this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
              return <OfferedParticipantGroupPanel offeredParticipantGroup={offeredParticipantGroup} key={"offered_participant_group_"+offeredParticipantGroup.id} />
            })}
          </div>
        </div>
      </div>
    )
  }
});
