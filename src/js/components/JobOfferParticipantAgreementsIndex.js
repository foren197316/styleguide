/* @flow */
'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var actions = require('../actions');
var mixins = require('../mixins');
var JobOfferParticipantAgreementStore = require('../stores/JobOfferParticipantAgreementStore');
var JobOfferParticipantAgreementsPanel = require('./JobOfferParticipantAgreementsPanel');
var SearchFilter = require('./SearchFilter');
var CheckBoxFilter = require('./CheckBoxFilter');
var BooleanFilter = require('./BooleanFilter');
var ExportButton = require('./ExportButton');
var ProgramStore = require('../stores/ProgramStore');

module.exports = React.createClass({displayName: 'JobOfferParticipantAgreementsIndex',
  mixins: [
    mixins.SetUrlsMixin,
    Reflux.connect(JobOfferParticipantAgreementStore, 'jobOfferParticipantAgreements')
  ],

  render: function () {
    var jobOfferIds = this.state.jobOfferParticipantAgreements ?
      this.state.jobOfferParticipantAgreements.mapAttribute('job_offer').mapAttribute('id') :
      [];

    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          SearchFilter({title: 'Search', searchOn: [['job_offer', 'participant', 'name'], ['job_offer', 'participant', 'email'], ['job_offer', 'participant', 'uuid']], actions: actions.JobOfferParticipantAgreementActions}),
          CheckBoxFilter({title: 'Program', store: ProgramStore, actions: actions.ProgramActions}),
          BooleanFilter({title: 'FileMaker', label: 'Not in FileMaker', action: JobOfferParticipantAgreementStore.toggleNotInFileMaker}),
          ExportButton({url: this.props.urls.export, ids: jobOfferIds})
        ),
        React.DOM.div({className: 'col-md-9'},
          JobOfferParticipantAgreementsPanel({jobOfferParticipantAgreements: this.state.jobOfferParticipantAgreements})
        )
      )
    );
  }
});
