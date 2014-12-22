var EnglishLevelStore = Reflux.createStore({
  listenables: EnglishLevelActions,
  permission: true,

  init: function () {
    this.data = [
      { id: 10, name: "10" },
      { id: 9, name: "9" },
      { id: 8, name: "8" },
      { id: 7, name: "7" },
      { id: 6, name: "6" },
      { id: 5, name: "5" }
    ]
  }
});
