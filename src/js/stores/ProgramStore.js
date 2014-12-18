var ProgramStore = Reflux.createStore({
  resourceName: "programs",
  listenables: ProgramActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  }
});
