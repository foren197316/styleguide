var EmployerStore = Reflux.createStore({
  resourceName: 'employers',
  listenables: EmployerActions,

  init: function () {
    this.listenTo(GlobalActions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(GlobalActions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(GlobalActions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  },

  onLoadFromJobOfferGroups: function (jobOfferGroups) {
    EmployerActions.ajaxLoad(
      jobOfferGroups.mapAttribute('employer_id'),
      StaffActions.loadFromEmployer
    );
  },

  onLoadFromOfferedParticipantGroups: function (offeredParticipantGroups) {
    EmployerActions.ajaxLoad(
      offeredParticipantGroups.mapAttribute('employer_id'),
      StaffActions.loadFromEmployer
    );
  },

  onLoadFromJobOfferParticipantAgreements: function (jobOfferParticipantAgreements) {
    EmployerActions.ajaxLoad(
      jobOfferParticipantAgreements.mapAttribute('job_offer').mapAttribute('employer_id'),
      StaffActions.loadFromEmployer
    );
  },

  onUpdateOnReviewCount: function (employerId, enrollmentId, count) {
    this.data = this.data.map(function (employer) {
      if (employer.id === employerId) {
        employer.enrollments = employer.enrollments.map(function (enrollment) {
          if (enrollment.id === enrollmentId) {
            enrollment.on_review_count += count;
          }
          return enrollment;
        });
      }
      return employer;
    });

    this.trigger(this.data);
  }
});
