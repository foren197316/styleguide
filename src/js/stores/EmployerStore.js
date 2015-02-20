/* @flow */
'use strict';

var Reflux = require('reflux');
var actions = require('../actions');

module.exports = Reflux.createStore({
  resourceName: 'employers',
  listenables: actions.EmployerActions,

  init: function () {
    this.listenTo(actions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(actions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(actions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
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
    var updateEnrollmentOnReviewCount = function (enrollment) {
      if (enrollment.id === enrollmentId) {
        enrollment.on_review_count += count;
      }
      return enrollment;
    };

    if (this.singleton) {
      this.data.enrollments = this.data.enrollments.map(updateEnrollmentOnReviewCount);
    } else {
      this.data = this.data.map(function (employer) {
        if (employer.id === employerId) {
          employer.enrollments = employer.enrollments.map(updateEnrollmentOnReviewCount);
        }
        return employer;
      });
    }

    this.trigger(this.data);
  }
});
