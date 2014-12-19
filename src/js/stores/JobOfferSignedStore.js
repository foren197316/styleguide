var JobOfferSignedStore = Reflux.createStore({
  listenables: JobOfferSignedActions,
  permission: true,

  init: function () {
    this.data = [
      { id: "true", name: "Signed" },
    ];
  }
});
