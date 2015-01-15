var ParticipantStore = Reflux.createStore({
  resourceName: 'participants',
  listenables: ParticipantActions,

  init: function () {
  },

  initPostAjaxLoad: function (participants, context) {
    switch (context) {
      case CONTEXT.IN_MATCHING:
        CountryActions.setCountries(participants);
        break;
    }

    this.trigger(this.data);
  },

  cleanup: function (_deletedParticipants) {
    CountryActions.setCountries(this.data);
  }
});
