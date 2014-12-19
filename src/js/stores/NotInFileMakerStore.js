var NotInFileMakerStore = Reflux.createStore({
  listenables: NotInFileMakerActions,
  permission: true,

  init: function () {
    this.data = [
      { id: "false", name: "Not in FileMaker" }
    ];
  }
});
