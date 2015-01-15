var JobOfferSignedStore = Reflux.createStore({
  listenables: JobOfferSignedActions,
  permission: true,

  init: function () {
    this.data = [
      { id: 'All Signed', name: 'All Signed' },
      { id: 'Any Unsigned', name: 'Any Unsigned' }
    ];
  }
});
