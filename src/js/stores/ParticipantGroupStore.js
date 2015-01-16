var ParticipantGroupStore = Reflux.createStore({
  resourceName: "participantGroups",
  listenables: ParticipantGroupActions,

  init: function () {
  },

  initPostAjaxLoad: function (participantGroups, context) {
    ParticipantActions.deprecatedAjaxLoad(this.data.mapAttribute("participant_ids").flatten(), context);

    switch (context) {
      case CONTEXT.IN_MATCHING:
        ParticipantGroupNameActions.setNames(participantGroups);
        EmployerActions.setSingleton();
        EmployerActions.deprecatedAjaxLoad(context);
        this.joinListener = this.joinTrailing(EmployerStore, ParticipantStore, ProgramStore, this.filterByRegionAndProgram);
        break;
    }
  },

  setParticipants: function (participants) {
    this.participantsListener.stop();

    this.data = this.data.map(function (participantGroup) {
      participantGroup.participants = participants.findById(participantGroup.participant_ids) || [];
      return participantGroup;
    });

    this.trigger(this.data);
  },

  filterByRegionAndProgram: function (employerResults, participantResults, programResults) {
    this.joinListener.stop();

    var employer = employerResults[0][0];
    var participants = participantResults[0];
    var programIds = programResults[0].mapAttribute("id");
    var deletedGroups = [];

    this.data = this.data.map(function (participantGroup) {
      var groupParticipants = participants.findById(participantGroup.participant_ids);

      if (programIds.indexOf(groupParticipants[0].program_id) < 0) {
        deletedGroups.push(participantGroup);
        return null;
      }

      if (groupParticipants.mapAttribute("region_ids").flatten().indexOf(employer.region_id) < 0) {
        deletedGroups.push(participantGroup);
        return null;
      }

      participantGroup.participants = groupParticipants;
      return participantGroup;
    }).notEmpty();

    this.cleanup(deletedGroups);
    this.trigger(this.data);
  },

  cleanup: function (deletedGroups) {
    var participantIds = deletedGroups.mapAttribute("participant_ids").flatten();
    ParticipantActions.removeByIds(participantIds);
  }
});
