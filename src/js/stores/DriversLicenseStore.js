var DriversLicenseStore = Reflux.createStore({
  listenables: DriversLicenseActions,
  permission: true,

  init: function () {
    this.data = [
      { id: "true", name: "International Drivers License" }
    ]
  }
});
