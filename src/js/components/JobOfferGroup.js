/* @flow */
'use strict';

var React = require('react/addons');
var EmployerStore = require('../stores/EmployerStore');
var JobOfferGroupStore = require('../stores/JobOfferGroupStore');
var EmployerHeader = require('./EmployerHeader');
var JobOffer = require('./JobOffer');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var moment = require('moment');

var JobOfferGroup = React.createClass({displayName: 'JobOfferGroup',
  propTypes: {
    jobOfferGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  handleReject: function () {
    this.setState({ rejecting: true });
  },

  handleCancel: function() {
    this.setState({ rejecting: false });
  },

  handleConfirm: function() {
    this.setState({ sending: true });
    JobOfferGroupStore.destroy(this.props.jobOfferGroup.id);
  },

  render: function () {
    var actions = null;
    var employer = EmployerStore.findById(this.props.jobOfferGroup.employer_id);

    if (this.state.rejecting) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-danger', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (this.props.jobOfferGroup.can_reject) {
      actions = (
        React.DOM.button({className: 'btn btn-small btn-danger', onClick: this.handleReject}, 'Reject')
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.createElement(EmployerHeader, {employer: employer}),
        React.DOM.div({className: 'list-group'},
          this.props.jobOfferGroup.job_offers.map(function (jobOffer) {
            return React.createElement(JobOffer, {jobOffer: jobOffer, key: 'job_offer_'+jobOffer.id});
          })
        ),
        React.createElement(ParticipantGroupPanelFooter, {name: this.props.jobOfferGroup.name},
          actions,
          React.DOM.div({}, moment(this.props.jobOfferGroup.created_at).fromNow())
        )
      )
    );
  }
});

module.exports = JobOfferGroup;
