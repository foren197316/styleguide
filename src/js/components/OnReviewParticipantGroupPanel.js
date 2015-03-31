/* @flow */
'use strict';

let React = require('react/addons');
let $ = require('jquery');

let Alert = React.createFactory(require('./Alert'));
let ParticipantGroupPanelFooter = React.createFactory(require('./ParticipantGroupPanelFooter'));
let ParticipantGroupParticipant = React.createFactory(require('./ParticipantGroupParticipant'));
let ParticipantGroupParticipantDeclining = React.createFactory(require('./ParticipantGroupParticipantDeclining'));
let ParticipantGroupParticipantOffering = React.createFactory(require('./ParticipantGroupParticipantOffering'));
let { div, h1, strong, button, input, small, span, form } = React.DOM;

let OnReviewParticipantGroupPanelHeading = React.createClass({
  displayName: 'OnReviewParticipantGroupPanelHeading',
  propTypes: {
    onReviewParticipantGroup: React.PropTypes.object.isRequired
  },

  render () {
    return (
      div({className: 'panel-heading text-right'},
        h1({className: 'panel-title'},
          'On Review until ', strong({}, this.props.onReviewParticipantGroup.expires_on)
        )
      )
    );
  }
});

let OnReviewParticipantGroupPanelListGroup = React.createClass({
  displayName: 'OnReviewParticipantGroupPanelListGroup',
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    draftJobOfferValidState: React.PropTypes.object.isRequired,
    isOfferingState: React.PropTypes.object.isRequired,
    isDecliningState: React.PropTypes.object.isRequired,
    positions: React.PropTypes.array.isRequired,
    onReviewParticipantGroup: React.PropTypes.object.isRequired
  },

  getInitialState () {
    var state = {};

    for (let i=0; i<this.props.onReviewParticipantGroup.participants.length; i++) {
      state[this.stateName(i)] = false;
    }

    return state;
  },

  stateName (index) {
    return 'participantValid'+index.toString();
  },

  isFormValid () {
    for (let i=0; i<this.props.onReviewParticipantGroup.participants.length; i++) {
      if (!this.state[this.stateName(i)]) {
        return false;
      }
    }
    return true;
  },

  componentDidUpdate () {
    var valid = this.isFormValid();

    if (this.props.draftJobOfferValidState.value !== valid) {
      this.props.draftJobOfferValidState.requestChange(valid);
    }
  },

  render () {
    let participantNodes = this.props.onReviewParticipantGroup.participants.map((participant, i) => {
          if (this.props.isOfferingState.value) {
            let positions = this.props.positions.findById(participant.position_ids);
            return ParticipantGroupParticipantOffering({validationState: this.linkState(this.stateName(i)), key: participant.id, data: participant, positions});
          } else if (this.props.isDecliningState.value) {
            return ParticipantGroupParticipantDeclining({key: participant.id, data: participant});
          } else {
            return ParticipantGroupParticipant({key: participant.id, participant: participant});
          }
        });

    return (
      div({className: 'list-group'},
        participantNodes
      )
    );
  }
});

let OnReviewParticipantGroupPanelFooterButtonsOfferDecline = React.createClass({
  displayName: 'OnReviewParticipantGroupPanelFooterButtonsOfferDecline',

  propTypes: {
    isOfferingState: React.PropTypes.object.isRequired,
    isDecliningState: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
    participantNames: React.PropTypes.string.isRequired,
  },

  offerClick: function () {
    this.props.isOfferingState.requestChange(!this.props.isOfferingState.value);

    global.Intercom('trackEvent', 'clicked-employer-participants-offer', {
      employer_id: this.props.employerId,
      employer_name: this.props.employerName,
      participant_names: this.props.participantNames
    });
  },

  declineClick: function () {
    this.props.isDecliningState.requestChange(!this.props.isDecliningState.value);

    global.Intercom('trackEvent', 'clicked-employer-participants-decline', {
      employer_id: this.props.employerId,
      employer_name: this.props.employerName,
      participant_names: this.props.participantNames
    });
  },

  render: function() {
    return (
      div({className: 'btn-group clearfix'},
        button({className: 'btn btn-success', onClick: this.offerClick}, 'Offer'),
        button({className: 'btn btn-danger', onClick: this.declineClick}, 'Decline')
      )
    );
  }
});

let OnReviewParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({
  displayName: 'OnReviewParticipantGroupPanelFooterButtonsConfirmCancel',

  propTypes: {
    employer: React.PropTypes.object.isRequired,
    participantNames: React.PropTypes.string.isRequired,
    draftJobOfferValidState: React.PropTypes.object.isRequired,
    isOfferingState: React.PropTypes.object.isRequired,
  },

  onClick: function () {
    this.props.isOfferingState.requestChange(!this.props.isOfferingState.value);

    global.Intercom('trackEvent', 'canceled-employer-participants-offer', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.props.participantNames
    });
  },

  render: function() {
    var confirmButton = this.props.draftJobOfferValidState.value ?
      input({className: 'btn btn-success', type: 'submit', value: 'Confirm'}) :
      input({className: 'btn btn-success', type: 'submit', value: 'Confirm', disabled: 'disabled'});

    return (
      div({className: 'btn-group clearfix'},
        confirmButton,
        button({className: 'btn btn-default', onClick: this.onClick}, 'Cancel')
      )
    );
  }
});

let OnReviewParticipantGroupPanelFooterButtonsDeclineCancel = React.createClass({
  displayName: 'OnReviewParticipantGroupPanelFooterButtonsDeclineCancel',

  propTypes: {
    employer: React.PropTypes.object.isRequired,
    participantNames: React.PropTypes.string.isRequired,
    isDecliningState: React.PropTypes.object.isRequired,
  },

  onClick: function () {
    this.props.isDecliningState.requestChange(!this.props.isDecliningState.value);

    global.Intercom('trackEvent', 'canceled-employer-participants-decline', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.props.participantNames
    });
  },

  render: function () {
    return (
      div({className: 'btn-group clearfix'},
        input({className: 'btn btn-danger', type: 'submit', value: 'Decline'}),
        button({className: 'btn btn-default', onClick: this.onClick}, 'Cancel')
      )
    );
  }
});

let OnReviewParticipantGroupPanelFooter = React.createClass({
  displayName: 'OnReviewParticipantGroupPanelFooter',
  propTypes: {
    onReviewParticipantGroup: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
    participantNames: React.PropTypes.string.isRequired,
    draftJobOfferValidState: React.PropTypes.object.isRequired,
    isOfferingState: React.PropTypes.object.isRequired,
    isDecliningState: React.PropTypes.object.isRequired,
  },

  render: function() {
    let { onReviewParticipantGroup, employer, participantNames, isOfferingState, isDecliningState, draftJobOfferValidState } = this.props;
    let footerName = onReviewParticipantGroup.name + (onReviewParticipantGroup.program != null ? ' - ' + onReviewParticipantGroup.program.name : '');
    let buttonGroup = (() => {
      if (isOfferingState.value) {
        return React.createElement(OnReviewParticipantGroupPanelFooterButtonsConfirmCancel, {employer, participantNames, draftJobOfferValidState, isOfferingState});
      } else if (isDecliningState.value) {
        return React.createElement(OnReviewParticipantGroupPanelFooterButtonsDeclineCancel, {employer, participantNames, isDecliningState});
      } else {
        return React.createElement(OnReviewParticipantGroupPanelFooterButtonsOfferDecline, {employer, participantNames, isOfferingState, isDecliningState});
      }
    })();
    let legalese = (() => {
      if (isOfferingState.value) {
        return (
          small({},
            'By clicking offer I agree that the information entered is true and accurate to the best of my knowledge and that I will contact InterExchange if any information changes.'
          )
        );
      } else if (isDecliningState.value) {
        return span({}, 'Are you sure you want to decline this participant?');
      }
    })();

    return (
      React.createElement(ParticipantGroupPanelFooter, {name: footerName},
        buttonGroup,
        legalese
      )
    );
  }
});

let OnReviewParticipantGroupPanel = React.createClass({displayName: 'OnReviewParticipantGroupPanel',
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    positions: React.PropTypes.array.isRequired,
    onReviewParticipantGroup: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      isOffering: false,
      isDeclining: false,
      draftJobOfferValid: false
    };
  },

  participantNames: function () {
    return this.props.onReviewParticipantGroup.participants.map(p => p.name).join(', ');
  },

  handleSubmit: function(event) {
    event.preventDefault();

    let { onReviewParticipantGroup, employer } = this.props;

    var form = $(event.target),
        data = null,
        trackEventName = null,
        url = null;

    if (this.state.isOffering) {
      url = '/offered_participant_groups.json';
      trackEventName = 'confirmed-employer-participants-offer';
      data = {
        offered_participant_group: $.extend({
          employer_id: employer.id,
          on_review_participant_group_id: onReviewParticipantGroup.id
        }, form.serializeJSON())
      };
    } else if (this.state.isDeclining) {
      url = `/on_review_participant_groups/${onReviewParticipantGroup.id}.json`;
      trackEventName = 'confirmed-employer-participants-decline';
      data = {
        '_method': 'DELETE',
        on_review_participant_group: form.serializeJSON()
      };
    } else {
      return;
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      success: (data) => {
        this.setState({status: data.status});

        global.Intercom('trackEvent', trackEventName, {
          employer_id: employer.id,
          employer_name: employer.name,
          participant_names: this.participantNames()
        });
      },
      error: function(data) {
        console.log(data);
      }
    });
  },

  render: function() {
    let { onReviewParticipantGroup, employer, positions } = this.props;
    let participantNames = this.participantNames();
    let isOfferingState = this.linkState('isOffering');
    let isDecliningState = this.linkState('isDeclining');
    let draftJobOfferValidState = this.linkState('draftJobOfferValid');

    if (this.state.status) {
      var status = this.state.status;
      return React.createElement(Alert, {type: status.type, message: status.message, instructions: status.instructions, actionTitle: status.action.title, actionUrl: status.action.url});
    } else {
      return (
        form({className: 'panel panel-default participant-group-panel form-horizontal', role: 'form', onSubmit: this.handleSubmit},
          React.createElement(OnReviewParticipantGroupPanelHeading, {onReviewParticipantGroup}),
          React.createElement(OnReviewParticipantGroupPanelListGroup, {onReviewParticipantGroup, positions, isOfferingState, isDecliningState, draftJobOfferValidState}),
          React.createElement(OnReviewParticipantGroupPanelFooter, {onReviewParticipantGroup, employer, participantNames, isOfferingState, isDecliningState, draftJobOfferValidState}),
          React.createElement(ParticipantGroupPanelFooter, {name: ''},
            div({}, `Put On Review by ${onReviewParticipantGroup.created_by_name}`)
          )
        )
      );
    }
  }
});

module.exports = OnReviewParticipantGroupPanel;
