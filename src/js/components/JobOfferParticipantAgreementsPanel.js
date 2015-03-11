'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var actions = require('../actions');
var mixins = require('../mixins');
var ProgramStore = require('../stores/ProgramStore');
var PositionStore = require('../stores/PositionStore');
var EmployerStore = require('../stores/EmployerStore');
var StaffStore = require('../stores/StaffStore');
var ProgramHeader = require('./ProgramHeader');
var JobOfferParticipantAgreement = require('./JobOfferParticipantAgreement');

var JobOfferParticipantAgreementsPanel = React.createClass({displayName: 'JobOfferParticipantAgreementsPanel',
  mixins: [
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    mixins.RenderLoadedMixin('programs', 'positions', 'employers', 'staffs')
  ],

  propTypes: {
    jobOfferParticipantAgreements: React.PropTypes.array.isRequired
  },

  componentDidMount: function () {
    actions.JobOfferParticipantAgreementActions.ajaxLoad(actions.loadFromJobOfferParticipantAgreements);
    actions.PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({id: 'participant-group-panels'},
        this.state.programs.map(function (program) {
          var programJobOfferParticipantAgreements = this.props.jobOfferParticipantAgreements.filter(function (jobOfferParticipantAgreement) {
            return jobOfferParticipantAgreement.job_offer.participant.program_id === program.id;
          });

          if (programJobOfferParticipantAgreements.length > 0) {
            return (
              React.DOM.div({key: 'program_'+program.id},
                React.createElement(ProgramHeader, {program: program, collectionName: 'Participant Agreement', collection: programJobOfferParticipantAgreements}),
                programJobOfferParticipantAgreements.map(function (jobOfferParticipantAgreement) {
                  return React.createElement(JobOfferParticipantAgreement, {jobOfferParticipantAgreement: jobOfferParticipantAgreement, key: 'jobOfferParticipantAgreement_'+jobOfferParticipantAgreement.id});
                })
              )
            );
          }
        }, this)
      )
    );
  }
});

module.exports = JobOfferParticipantAgreementsPanel;
