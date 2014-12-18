var ParticipantStore = Reflux.createStore({
  resourceName: "participants",
  listenables: ParticipantActions,

  init: function () {
  },

  initPostAjaxLoad: function (participants, context) {
    switch (context) {
      case CONTEXT.OFFERED:
        ProgramActions.ajaxLoad(this.data.mapAttribute("program_id"));
        break;
      case CONTEXT.IN_MATCHING:
        CountryActions.setCountries(participants);
        break;
    }

    this.trigger(this.data);
  }
});
