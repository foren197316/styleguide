var StaffStore = Reflux.createStore({
  resourceName: "staffs",
  listenables: StaffActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    EmployerActions.setStaff(this.data);
  }
});
