var EmployerStore = Reflux.createStore({
  resourceName: "employers",
  listenables: EmployerActions,

  init: function () {
    this.listenTo(GlobalActions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
  },

  initPostAjaxLoad: function (_employers, context) {
    switch (context) {
      case CONTEXT.JOB_OFFER:
      case CONTEXT.OFFERED:
        StaffActions.deprecatedAjaxLoad(this.data.mapAttribute("staff_id"));
        this.staffListener = StaffStore.listen(this.onSetStaff);
        break;
      default:
        this.trigger(this.data);
    }
  },

  onLoadFromJobOfferGroups: function (jobOfferGroups) {
    EmployerActions.ajaxLoad(
      jobOfferGroups.mapAttribute("employer_id"),
      StaffActions.loadFromEmployer
    );
  },

  onSetStaff: function (staffs) {
    if (this.staffListener) {
      this.staffListener();
    }

    this.data = this.data.map(function (employer) {
      employer.staff = staffs.findById(employer.staff_id);
      return employer;
    });

    this.trigger(this.data);
  }
});
