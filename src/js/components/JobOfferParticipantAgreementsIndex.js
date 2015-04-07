/* @flow */
'use strict';
let React = require('react/addons');
let Reflux = require('reflux');
let actions = require('../actions');
let JobOfferParticipantAgreementStore = require('../stores/JobOfferParticipantAgreementStore');
let JobOfferParticipantAgreementsPanel = React.createFactory(require('./JobOfferParticipantAgreementsPanel'));
let SearchFilter = React.createFactory(require('./SearchFilter'));
let CheckBoxFilter = React.createFactory(require('./CheckBoxFilter'));
let BooleanFilter = React.createFactory(require('./BooleanFilter'));
let ExportButton = React.createFactory(require('./ExportButton'));
let ProgramStore = require('../stores/ProgramStore');
let { div } = React.DOM;

let JobOfferParticipantAgreementsIndex = React.createClass({
  displayName: 'JobOfferParticipantAgreementsIndex',
  mixins: [
    Reflux.connect(JobOfferParticipantAgreementStore, 'jobOfferParticipantAgreements')
  ],

  propTypes: {
    exportUrl: React.PropTypes.string.isRequired
  },

  render () {
    let jobOfferIds = this.state.jobOfferParticipantAgreements ?
      this.state.jobOfferParticipantAgreements.map(o => o.job_offer.id) :
      [];

    return (
      div({className: 'row'},
        div({className: 'col-md-3'},
          SearchFilter({title: 'Search', searchOn: [['job_offer', 'participant', 'name'], ['job_offer', 'participant', 'email'], ['job_offer', 'participant', 'uuid']], actions: actions.JobOfferParticipantAgreementActions}),
          CheckBoxFilter({title: 'Program', store: ProgramStore, actions: actions.ProgramActions}),
          BooleanFilter({title: 'FileMaker', label: 'Not in FileMaker', action: JobOfferParticipantAgreementStore.toggleNotInFileMaker}),
          ExportButton({url: this.props.exportUrl, ids: jobOfferIds})
        ),
        div({className: 'col-md-9'},
          JobOfferParticipantAgreementsPanel({jobOfferParticipantAgreements: this.state.jobOfferParticipantAgreements})
        )
      )
    );
  }
});

module.exports = JobOfferParticipantAgreementsIndex;
