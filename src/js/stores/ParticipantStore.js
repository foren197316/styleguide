var ParticipantStore = Reflux.createStore({
  resourceName: "participants",
  listenables: ParticipantActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    ProgramActions.ajaxLoad(this.data.mapAttribute("program_id"));
  },

  onSetPrograms: function (programs) {
    this.data = this.data.map(function (participant) {
      participant.program = programs.findById(participant.program_id);
      return participant;
    });

    ParticipantGroupActions.setParticipants(this.data);
  }
});
