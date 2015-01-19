'use strict';

var actions = require('../actions');

var EmployerStore = Reflux.createStore({
  resourceName: 'employers',
  listenables: actions.EmployerActions,

  init: function () {
    this.listenTo(actions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(actions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(actions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
  },

  initPostAjaxLoad: function () {
    this.trigger(this.data);
  },

  onLoadFromJobOfferGroups: function (jobOfferGroups) {
    actions.EmployerActions.ajaxLoad(
      jobOfferGroups.mapAttribute('employer_id'),
      actions.StaffActions.loadFromEmployer
    );
  },

  onLoadFromOfferedParticipantGroups: function (offeredParticipantGroups) {
    actions.EmployerActions.ajaxLoad(
      offeredParticipantGroups.mapAttribute('employer_id'),
      actions.StaffActions.loadFromEmployer
    );
  },

  onLoadFromJobOfferParticipantAgreements: function (jobOfferParticipantAgreements) {
    actions.EmployerActions.ajaxLoad(
      jobOfferParticipantAgreements.mapAttribute('job_offer').mapAttribute('employer_id'),
      actions.StaffActions.loadFromEmployer
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

module.exports = EmployerStore;
