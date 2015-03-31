/* @flow */
'use strict';
let React = require('react/addons');
let actions = require('../actions');
let EmployerStore = require('../stores/EmployerStore');
let PositionStore = require('../stores/PositionStore');
let StaffStore = require('../stores/StaffStore');
let EmployerHeader = React.createFactory(require('./EmployerHeader'));
let ParticipantGroupPanelFooter = React.createFactory(require('./ParticipantGroupPanelFooter'));
let OfferedParticipantGroupParticipant = require('./OfferedParticipantGroupParticipant');
let Alert = require('./Alert');
let $ = require('jquery');
let moment = require('moment');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let { div, button, span } = React.DOM;

module.exports = React.createClass({displayName: 'OfferedParticipantGroupPanel',
  propTypes: {
    offeredParticipantGroup: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      puttingOnReview: false,
      rejecting: false,
      sending: false,
      sendingJobOffer: false
    };
  },

  hasJobOffers () {
    return this.props.offeredParticipantGroup.job_offers.length > 0;
  },

  handleSendToParticipant () {
    this.setState({ sendingJobOffer: true });
  },

  handleReject () {
    this.setState({ rejecting: true });
  },

  handleCanceln () {
    this.setState({ sendingJobOffer: false, rejecting: false });
  },

  handleConfirm () {
    this.setState({ sending: true });
    let node = this.getDOMNode();

    if (this.state.sendingJobOffer) {
      JobOfferGroupStore.create({ offered_participant_group_id: this.props.offeredParticipantGroup.id })
      .then(response => {
        this.setState({ status: response.data.status });
      });
    } else if (this.state.rejecting) {
      actions.OfferedParticipantGroupActions.reject(this.props.offeredParticipantGroup.id, () => {
        React.unmountComponentAtNode(node);
        $(node).remove();
      });
    }
  },

  render () {
    let actions;
    let footerName = this.props.offeredParticipantGroup.name;
    let employer = EmployerStore.findById(this.props.offeredParticipantGroup.employer_id);
    let staff = StaffStore.findById(employer.staff_id);
    let draftJobOffers = this.props.offeredParticipantGroup.draft_job_offers;
    let participants = this.props.offeredParticipantGroup.participants;

    let participantNodes = draftJobOffers.map(draftJobOffer => {
      let participant = participants.findById(draftJobOffer.participant_id);
      let position = PositionStore.findById(draftJobOffer.position_id);

      return (
        React.createElement(OfferedParticipantGroupParticipant, {
          key: participant.id,
          participant: participant,
          position: position,
          offer: draftJobOffer,
          offerLinkTitle: 'Preview'})
      );
    });

    if (this.state.status) {
      let status = this.state.status;
      return React.createElement(Alert, {type: status.type, message: status.message, instructions: status.instructions, actionTitle: status.action.title, actionUrl: status.action.url});
    } else if (this.state.sendingJobOffer) {
      actions = (
        div({className: 'btn-group'},
          button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (this.state.rejecting) {
      actions = (
        div({className: 'btn-group'},
          button({className: 'btn btn-danger', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (!this.props.offeredParticipantGroup.can_send) {
      actions = null;
    } else if (!employer.vetted) {
      actions = (
        div({},
          span({className: 'label label-warning pull-left'}, 'Employer Not Vetted'),
          button({className: 'btn btn-small btn-danger', onClick: this.handleReject}, 'Reject')
        )
      );
    } else {
      actions = (
        div({className: 'btn-group'},
          button({className: 'btn btn-success', onClick: this.handleSendToParticipant}, 'Send to Participant'),
          button({className: 'btn btn-danger', onClick: this.handleReject}, 'Reject')
        )
      );
    }

    return (
      div({className: 'panel panel-default participant-group-panel'},
        EmployerHeader({employer, staff}),
        div({className: 'list-group'},
          participantNodes
        ),
        ParticipantGroupPanelFooter({name: footerName},
          actions,
          div({}, moment(this.props.offeredParticipantGroup.created_at).fromNow())
        )
      )
    );
  }
});
