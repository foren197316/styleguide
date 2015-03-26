/* @flow */
'use strict';

let Reflux = require('reflux');
let actions = require('../actions');

let EmployerStore = Reflux.createStore({
  resourceName: 'employers',
  listenables: actions.EmployerActions,

  init () {
    this.listenTo(actions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(actions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(actions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
    this.listenTo(actions.loadFromJobListings, this.onLoadFromJobListings);
  },

  onLoadFromJobOfferGroups (data) {
    let jobOfferGroups = data.job_offer_groups;
    actions.EmployerActions.ajaxLoad(
      jobOfferGroups.mapAttribute('employer_id'),
      actions.StaffActions.loadFromEmployer
    );
  },

  onLoadFromOfferedParticipantGroups (data) {
    let offeredParticipantGroups = data.offered_participant_groups;
    actions.EmployerActions.ajaxLoad(
      offeredParticipantGroups.mapAttribute('employer_id'),
      actions.StaffActions.loadFromEmployer
    );
  },

  onLoadFromJobOfferParticipantAgreements (data) {
    let jobOfferParticipantAgreements = data.job_offer_participant_agreements;
    actions.EmployerActions.ajaxLoad(
      jobOfferParticipantAgreements.mapAttribute('job_offer').mapAttribute('employer_id'),
      actions.StaffActions.loadFromEmployer
    );
  },

  onLoadFromJobListings (data) {
    let employers = data.employers;
    this.data = employers;
    this.trigger(this.data);
  },

  onUpdateOnReviewCount (employerId, enrollmentId, count) {
    var updateEnrollmentOnReviewCount = (enrollment) => {
      if (enrollment.id === enrollmentId) {
        enrollment.on_review_count += count;
      }
      return enrollment;
    };

    if (this.singleton) {
      this.data.enrollments = this.data.enrollments.map(updateEnrollmentOnReviewCount);
    } else {
      this.data = this.data.map(employer => {
        if (employer.id === employerId) {
          employer.enrollments = employer.enrollments.map(updateEnrollmentOnReviewCount);
        }
        return employer;
      });
    }

    this.trigger(this.data);
  },

  set (data) {
    if (data == null) {
      return;
    }

    this.mergeData(data);

    this.trigger(this.data);
  },

  mergeData (data) {
    if (this.data == null) {
      this.data = data;
    } else {
      Object.keys(data).forEach(key => {
        this.data[key] = data[key];
      });
    }
  }
});

module.exports = EmployerStore;
