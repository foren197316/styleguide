var EmployerStore = Reflux.createStore({
  resourceName: "employers",
  listenables: EmployerActions,

  init: function () {
    this.listenTo(GlobalActions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(GlobalActions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
  },

  initPostAjaxLoad: function (_employers, context) {
    switch (context) {
      case CONTEXT.JOB_OFFER:
        StaffActions.ajaxLoad(this.data.mapAttribute("staff_id"), EmployerActions.setStaff);
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

  onLoadFromOfferedParticipantGroups: function (offeredParticipantGroups) {
    EmployerActions.ajaxLoad(
      offeredParticipantGroups.mapAttribute("employer_id"),
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
