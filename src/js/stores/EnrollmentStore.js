var EnrollmentStore = Reflux.createStore({
  resourceName: "enrollments",
  listenables: EnrollmentActions,

  initPostAjaxLoad: function () {
    this.filterSearchableEnrollments();
    ProgramActions.ajaxLoad(this.data.mapAttribute("program_id"));
    this.trigger(this.data);
  },

  filterSearchableEnrollments: function () {
    this.data = this.data.filter(function (enrollment) {
      return enrollment.searchable;
    });
  },

  onUpdateOnReviewCount: function (enrollmentId, count) {
    this.data = this.data.map(function (enrollment) {
      if (enrollment.id === enrollmentId) {
        enrollment.on_review_count += count;
      }
      return enrollment;
    });

    this.trigger(this.data);
  }
});
