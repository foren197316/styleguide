var ParticipantSignedStore = Reflux.createStore({
  listenables: ParticipantSignedActions,
  permission: true,

  init: function () {
    this.data = [
      { id: 'Signed', name: 'All Signed' },
      { id: 'Unsigned', name: 'Any Unsigned' }
    ];
  }
});
