/* @flow */
'use strict';
let Reflux = require('reflux');
let {
  EmployerActions,
  StaffActions,
  loadFromOfferedParticipantGroups,
  loadFromJobOfferParticipantAgreements,
  loadFromJobListings,
  loadFromOnReviewParticipantGroups,
  loadFromJobOfferGroups
} = require('../actions');
let nameSort = require('../util/name-sort');

let EmployerStore = Reflux.createStore({
  resourceName: 'employers',
  listenables: EmployerActions,

  init () {
    this.listenTo(loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
    this.listenTo(loadFromJobListings, this.extractFromData);
    this.listenTo(loadFromOnReviewParticipantGroups, this.extractFromData);
    this.listenTo(loadFromJobOfferGroups, this.extractFromData);
  },

  onLoadFromOfferedParticipantGroups (data) {
    let offeredParticipantGroups = data.offered_participant_groups;
    EmployerActions.ajaxLoad(
      offeredParticipantGroups.mapAttribute('employer_id'),
      StaffActions.loadFromEmployer
    );
  },

  onLoadFromJobOfferParticipantAgreements (data) {
    let jobOfferParticipantAgreements = data.job_offer_participant_agreements;
    EmployerActions.ajaxLoad(
      jobOfferParticipantAgreements.mapAttribute('job_offer').mapAttribute('employer_id'),
      StaffActions.loadFromEmployer
    );
  },

  extractFromData (data) {
    this.permission = true;
    this.data = data.employers.sort(nameSort);
    this.trigger(this.data);
  },

  onUpdateOnReviewCount (employerId, enrollmentId, count) {
    let updateEnrollmentOnReviewCount = (enrollment) => {
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

    this.permission = true;
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
