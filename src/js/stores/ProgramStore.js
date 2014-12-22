var ProgramStore = Reflux.createStore({
  resourceName: "programs",
  listenables: ProgramActions,

  init: function () {
  },

  initPostAjaxLoad: function (_programs, _context) {
    this.trigger(this.data);
  }
});
