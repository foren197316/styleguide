'use strict';

var actions = require('../actions');

var ProgramStore = Reflux.createStore({
  resourceName: 'programs',
  listenables: actions.ProgramActions,
  applicableIds: null,

  init: function () {
    this.listenTo(actions.loadFromJobOfferGroups, this.onLoadFromJobOfferGroups);
    this.listenTo(actions.loadFromOfferedParticipantGroups, this.onLoadFromOfferedParticipantGroups);
    this.listenTo(actions.loadFromJobOfferParticipantAgreements, this.onLoadFromJobOfferParticipantAgreements);
  },

  initPostAjaxLoad: function () {
    if (this.applicableIds !== null) {
      this.data = this.data.filter(function (program) {
        return this.applicableIds.indexOf(program.id) >= 0;
      }, this);
    }

    this.trigger(this.data);
  },

  onLoadFromJobOfferGroups: function (jobOfferGroups) {
    this.applicableIds = jobOfferGroups.map(function (jobOfferGroup) {
      return jobOfferGroup.job_offers[0].participant.program_id;
    }).uniq();

    actions.ProgramActions.ajaxLoad();
  },

  onLoadFromOfferedParticipantGroups: function (offeredParticipantGroups) {
    this.applicableIds = offeredParticipantGroups.map(function (offeredParticipantGroup) {
      return offeredParticipantGroup.participants[0].program_id;
    }).uniq();

    actions.ProgramActions.ajaxLoad();
  },

  onLoadFromJobOfferParticipantAgreements: function (jobOfferParticipantAgreements) {
    this.applicableIds = jobOfferParticipantAgreements.map(function (jobOfferParticipantAgreement) {
      return jobOfferParticipantAgreement.job_offer.participant.program_id;
    }).uniq();

    actions.ProgramActions.ajaxLoad();
  }
});

module.exports = ProgramStore;
