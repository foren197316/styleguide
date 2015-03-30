/* @flow */
'use strict';

var React = require('react/addons');
var EmployerStore = require('../stores/EmployerStore');
var EmployerHeader = require('./EmployerHeader');
var JobOffer = React.createFactory(require('./JobOffer'));
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var moment = require('moment');
let { div } = React.DOM;

module.exports = React.createClass({
  displayName: 'JobOfferParticipantAgreement',
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreement: React.PropTypes.object.isRequired,
    position: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    let employer = EmployerStore.findById(this.props.jobOfferParticipantAgreement.job_offer.employer_id);
    let { jobOffer, position, jobOfferParticipantAgreement } = this.props;

    return (
      div({className: 'panel panel-default participant-group-panel'},
        React.createElement(EmployerHeader, {employer: employer}),
        div({className: 'list-group'},
          JobOffer({jobOffer, jobOfferParticipantAgreement, position})
        ),
        React.createElement(ParticipantGroupPanelFooter, {name: ''},
          div({}, moment(this.props.jobOfferParticipantAgreement.created_at).fromNow())
        )
      )
    );
  }
});
