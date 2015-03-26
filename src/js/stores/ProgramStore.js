'use strict';

let Reflux = require('reflux');
let actions = require('../actions');

let ProgramStore = Reflux.createStore({
  resourceName: 'programs',
  listenables: actions.ProgramActions,
  applicableIds: null,

  init () {
    this.listenTo(actions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(actions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(actions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
  },

  initPostAjaxLoad () {
    if (this.applicableIds != null) {
      this.data = this.data.filter(program => (
        this.applicableIds.indexOf(program.id) >= 0
      ));
    }

    this.trigger(this.data);
  },

  onLoadFromJobOfferGroups (data) {
    let jobOfferGroups = data.job_offer_groups;
    this.applicableIds = jobOfferGroups.map(jobOfferGroup => (
      jobOfferGroup.job_offers[0].participant.program_id
    )).uniq();

    actions.ProgramActions.ajaxLoad();
  },

  onLoadFromOfferedParticipantGroups (data) {
    let offeredParticipantGroups = data.offered_participant_groups;
    this.applicableIds = offeredParticipantGroups.map(offeredParticipantGroup => (
      offeredParticipantGroup.participants[0].program_id
    )).uniq();

    actions.ProgramActions.ajaxLoad();
  },

  onLoadFromJobOfferParticipantAgreements (data) {
    let jobOfferParticipantAgreements = data.job_offer_participant_agreements;
    this.applicableIds = jobOfferParticipantAgreements.map(jobOfferParticipantAgreement => (
      jobOfferParticipantAgreement.job_offer.participant.program_id
    )).uniq();

    actions.ProgramActions.ajaxLoad();
  }
});

module.exports = ProgramStore;
