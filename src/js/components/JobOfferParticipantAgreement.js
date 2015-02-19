/* @flow */
'use strict';

var React = require('react/addons');
var EmployerStore = require('../stores/EmployerStore');
var EmployerHeader = require('./EmployerHeader');
var JobOffer = require('./JobOffer');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var moment = require('moment');

module.exports = React.createClass({displayName: 'JobOfferParticipantAgreement',
  propTypes: {
    jobOfferParticipantAgreement: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  render: function () {
    var employer = EmployerStore.findById(this.props.jobOfferParticipantAgreement.job_offer.employer_id);

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        EmployerHeader({employer: employer}),
        React.DOM.div({className: 'list-group'},
          JobOffer({jobOffer: this.props.jobOfferParticipantAgreement.job_offer, jobOfferParticipantAgreement: this.props.jobOfferParticipantAgreement})
        ),
        ParticipantGroupPanelFooter({name: ''},
          React.DOM.div(null, moment(this.props.jobOfferParticipantAgreement.created_at).fromNow())
        )
      )
    );
  }
});
