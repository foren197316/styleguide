var EmployerStore = Reflux.createStore({
  resourceName: "employers",
  listenables: EmployerActions,

  init: function () {
  },

  initPostAjaxLoad: function () {
    StaffActions.ajaxLoad(this.data.mapAttribute("staff_id"));
  },

  onSetStaff: function (staffs) {
    this.data = this.data.map(function (employer) {
      employer.staff = staffs.findById(employer.staff_id);
      return employer;
    });

    this.trigger(this.data);
  }
});
