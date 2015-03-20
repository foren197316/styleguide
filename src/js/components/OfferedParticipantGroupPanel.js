/* @flow */
'use strict';

var React = require('react/addons');
var actions = require('../actions');
var EmployerStore = require('../stores/EmployerStore');
var PositionStore = require('../stores/PositionStore');
var EmployerHeader = require('./EmployerHeader');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var OfferedParticipantGroupParticipant = require('./OfferedParticipantGroupParticipant');
var Alert = require('./Alert');
var $ = require('jquery');
var moment = require('moment');
var JobOfferGroupStore = require('../stores/JobOfferGroupStore');

module.exports = React.createClass({displayName: 'OfferedParticipantGroupPanel',
  propTypes: {
    offeredParticipantGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      puttingOnReview: false,
      rejecting: false,
      sending: false,
      sendingJobOffer: false
    };
  },

  hasJobOffers: function () {
    return this.props.offeredParticipantGroup.job_offers.length > 0;
  },

  handleSendToParticipant: function () {
    this.setState({ sendingJobOffer: true });
  },

  handleReject: function () {
    this.setState({ rejecting: true });
  },

  handleCancel: function() {
    this.setState({ sendingJobOffer: false, rejecting: false });
  },

  handleConfirm: function() {
    this.setState({ sending: true });
    var node = this.getDOMNode();

    if (this.state.sendingJobOffer) {
      JobOfferGroupStore.create({ offered_participant_group_id: this.props.offeredParticipantGroup.id }, function (response) {
        this.setState({ status: response.responseJSON.status });
      }.bind(this));
    } else if (this.state.rejecting) {
      actions.OfferedParticipantGroupActions.reject(this.props.offeredParticipantGroup.id, function () {
        React.unmountComponentAtNode(node);
        $(node).remove();
      });
    }
  },

  render: function() {
    var actions;
    var footerName = this.props.offeredParticipantGroup.name;
    var employer = EmployerStore.findById(this.props.offeredParticipantGroup.employer_id);
    var draftJobOffers = this.props.offeredParticipantGroup.draft_job_offers;
    var participants = this.props.offeredParticipantGroup.participants;

    var participantNodes = draftJobOffers.map(function (draftJobOffer) {
      var participant = participants.findById(draftJobOffer.participant_id);
      var position = PositionStore.findById(draftJobOffer.position_id);

      return (
        React.createElement(OfferedParticipantGroupParticipant, {
          key: participant.id,
          participant: participant,
          position: position,
          offer: draftJobOffer,
          offerLinkTitle: 'Preview'})
      );
    }, this);

    if (this.state.status) {
      var status = this.state.status;
      return React.createElement(Alert, {type: status.type, message: status.message, instructions: status.instructions, actionTitle: status.action.title, actionUrl: status.action.url});
    } else if (this.state.sendingJobOffer) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (this.state.rejecting) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-danger', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (!this.props.offeredParticipantGroup.can_send) {
      actions = null;
    } else if (!employer.vetted) {
      actions = (
        React.DOM.div({},
          React.DOM.span({className: 'label label-warning pull-left'}, 'Employer Not Vetted'),
          React.DOM.button({className: 'btn btn-small btn-danger', onClick: this.handleReject}, 'Reject')
        )
      );
    } else {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-success', onClick: this.handleSendToParticipant}, 'Send to Participant'),
          React.DOM.button({className: 'btn btn-danger', onClick: this.handleReject}, 'Reject')
        )
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.createElement(EmployerHeader, {employer: employer}),
        React.DOM.div({className: 'list-group'},
          participantNodes
        ),
        React.createElement(ParticipantGroupPanelFooter, {name: footerName},
          actions,
          React.DOM.div({}, moment(this.props.offeredParticipantGroup.created_at).fromNow())
        )
      )
    );
  }
});