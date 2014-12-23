var EmployerStore = Reflux.createStore({
  resourceName: "employers",
  listenables: EmployerActions,

  init: function () {
  },

  initPostAjaxLoad: function (_employers, context) {
    switch (context) {
      case CONTEXT.JOB_OFFER:
      case CONTEXT.OFFERED:
        StaffActions.ajaxLoad(this.data.mapAttribute("staff_id"));
        break;
      default:
        this.trigger(this.data);
    }
  },

  onSetStaff: function (staffs) {
    this.data = this.data.map(function (employer) {
      employer.staff = staffs.findById(employer.staff_id);
      return employer;
    });

    this.trigger(this.data);
  }
});
