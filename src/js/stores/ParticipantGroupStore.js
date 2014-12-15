var ParticipantGroupStore = Reflux.createStore({
  resourceName: "participantGroups",
  listenables: ParticipantGroupActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    ParticipantActions.ajaxLoad(this.data.mapAttribute("participant_ids").flatten());
  },

  onSetParticipants: function (participants) {
    this.data = this.data.map(function (participantGroup) {
      participantGroup.participants = participants.findById(participantGroup.participant_ids) || [];
      return participantGroup;
    });

    this.trigger(this.data);
  }
});
