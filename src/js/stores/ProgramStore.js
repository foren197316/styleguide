var ProgramStore = Reflux.createStore({
  resourceName: "programs",
  listenables: ProgramActions,

  init: function () {
  },

  initPostAjaxLoad: function (_programs, context) {
    this.trigger(this.data);
  }
});
