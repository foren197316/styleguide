var PositionStore = Reflux.createStore({
  resourceName: "positions",
  listenables: PositionActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  }
});
