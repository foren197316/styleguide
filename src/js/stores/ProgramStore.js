var ProgramStore = Reflux.createStore({
  resourceName: "programs",
  listenables: ProgramActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    ParticipantActions.setPrograms(this.data);
  }
});
