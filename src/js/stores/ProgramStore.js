'use strict';
let Reflux = require('reflux');
let {
  ProgramActions,
  loadFromJobOfferGroups,
  loadFromOfferedParticipantGroups,
  loadFromJobOfferParticipantAgreements,
  loadFromOnReviewParticipantGroups
} = require('../actions');
let nameSort = require('../util/name-sort');

let ProgramStore = Reflux.createStore({
  resourceName: 'programs',
  listenables: ProgramActions,
  applicableIds: null,

  init () {
    this.listenTo(loadFromJobOfferGroups, this.extractProgramsFromResponse);
    this.listenTo(loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
    this.listenTo(loadFromOnReviewParticipantGroups, this.extractProgramsFromResponse);
  },

  initPostAjaxLoad () {
    if (this.applicableIds != null) {
      this.data = this.data.filter(program => (
        this.applicableIds.indexOf(program.id) >= 0
      ));
    }

    this.trigger(this.data);
  },

  extractProgramsFromResponse (data) {
    this.set(data.programs);
  },

  onLoadFromOfferedParticipantGroups (data) {
    let offeredParticipantGroups = data.offered_participant_groups;
    this.applicableIds = offeredParticipantGroups.map(offeredParticipantGroup => (
      offeredParticipantGroup.participants[0].program_id
    )).uniq();

    ProgramActions.ajaxLoad();
  },

  onLoadFromJobOfferParticipantAgreements (data) {
    let jobOfferParticipantAgreements = data.job_offer_participant_agreements;
    this.applicableIds = jobOfferParticipantAgreements.map(jobOfferParticipantAgreement => (
      jobOfferParticipantAgreement.job_offer.participant.program_id
    )).uniq();

    ProgramActions.ajaxLoad();
  },

  set (programs) {
    this.permission = true;
    this.data = programs.sort(nameSort);
    this.trigger(this.data);
  }
});

module.exports = ProgramStore;
