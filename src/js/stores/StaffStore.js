var StaffStore = Reflux.createStore({
  resourceName: "staffs",
  listenables: StaffActions,

  init: function () {
  },

  onLoadFromEmployer: function (employers) {
    StaffActions.ajaxLoad(employers.mapAttribute("staff_id"));
  }
});
