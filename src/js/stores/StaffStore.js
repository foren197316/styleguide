var StaffStore = Reflux.createStore({
  resourceName: "staffs",
  listenables: StaffActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
    // EmployerActions.setStaff(this.data);
  },

  onLoadFromEmployer: function (employers) {
    StaffActions.ajaxLoad(employers.mapAttribute("staff_id"));
  }
});
