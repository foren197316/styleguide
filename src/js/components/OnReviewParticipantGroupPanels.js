'use strict';

var React = require('react/addons');
var Intercom = require('intercom.io');
var ParticipantGroupParticipantOffering = require('./ParticipantGroupParticipantOffering');
var ParticipantGroupParticipantDeclining = require('./ParticipantGroupParticipantDeclining');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
var Alert = require('./Alert');
var Spinner = require('./Spinner');

var OnReviewParticipantGroupPanelHeading = React.createClass({displayName: 'OnReviewParticipantGroupPanelHeading',
  render: function() {
    return (
      React.DOM.div({className: 'panel-heading text-right'},
        React.DOM.h1({className: 'panel-title'}, 'On Review until ', React.DOM.strong(null, this.props.data.expires_on))
      )
    );
  }
});

var OnReviewParticipantGroupPanelListGroup = React.createClass({displayName: 'OnReviewParticipantGroupPanelListGroup',
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    draftJobOfferValidState: React.PropTypes.object.isRequired,
    isOfferingState: React.PropTypes.object.isRequired,
    isDecliningState: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    var state = {};

    for (var i=0; i<this.props.data.participants.length; i++) {
      state[this.stateName(i)] = false;
    }

    return state;
  },

  stateName: function (index) {
    return 'participantValid'+index.toString();
  },

  isFormValid: function () {
    for (var i=0; i<this.props.data.participants.length; i++) {
      if (!this.state[this.stateName(i)]) {
        return false;
      }
    }
    return true;
  },

  componentDidUpdate: function () {
    var valid = this.isFormValid();

    if (this.props.draftJobOfferValidState.value !== valid) {
      this.props.draftJobOfferValidState.requestChange(valid);
    }
  },

  render: function() {
    var participantNodes = this.props.data.participants.map(function (participant, i) {
          if (this.props.isOfferingState.value) {
            return ParticipantGroupParticipantOffering({validationState: this.linkState(this.stateName(i)), key: participant.id, data: participant});
          } else if (this.props.isDecliningState.value) {
            return ParticipantGroupParticipantDeclining({key: participant.id, data: participant});
          } else {
            return ParticipantGroupParticipant({key: participant.id, participant: participant});
          }
        }.bind(this));

    return (
      React.DOM.div({className: 'list-group'},
        participantNodes
      )
    );
  }
});

var OnReviewParticipantGroupPanelFooterButtonsOfferDecline = React.createClass({displayName: 'OnReviewParticipantGroupPanelFooterButtonsOfferDecline',
  offerClick: function () {
    this.props.isOfferingState.requestChange(!this.props.isOfferingState.value);

    Intercom('trackEvent', 'clicked-employer-participants-offer', {
      employer_id: this.props.employerId,
      employer_name: this.props.employerName,
      participant_names: this.props.participantNames
    });
  },

  declineClick: function () {
    this.props.isDecliningState.requestChange(!this.props.isDecliningState.value);

    Intercom('trackEvent', 'clicked-employer-participants-decline', {
      employer_id: this.props.employerId,
      employer_name: this.props.employerName,
      participant_names: this.props.participantNames
    });
  },

  render: function() {
    return (
      React.DOM.div({className: 'btn-group clearfix'},
        React.DOM.button({className: 'btn btn-success', onClick: this.offerClick}, 'Offer'),
        React.DOM.button({className: 'btn btn-danger', onClick: this.declineClick}, 'Decline')
      )
    );
  }
});

var OnReviewParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({displayName: 'OnReviewParticipantGroupPanelFooterButtonsConfirmCancel',
  onClick: function () {
    this.props.isOfferingState.requestChange(!this.props.isOfferingState.value);

    Intercom('trackEvent', 'canceled-employer-participants-offer', {
      employer_id: this.props.employerId,
      employer_name: this.props.employerName,
      participant_names: this.props.participantNames
    });
  },

  render: function() {
    var confirmButton = this.props.draftJobOfferValidState.value ?
      React.DOM.input({className: 'btn btn-success', type: 'submit', value: 'Confirm'}) :
      React.DOM.input({className: 'btn btn-success', type: 'submit', value: 'Confirm', disabled: 'disabled'});

    return (
      React.DOM.div({className: 'btn-group clearfix'},
        confirmButton,
        React.DOM.button({className: 'btn btn-default', onClick: this.onClick}, 'Cancel')
      )
    );
  }
});

var OnReviewParticipantGroupPanelFooterButtonsDeclineCancel = React.createClass({displayName: 'OnReviewParticipantGroupPanelFooterButtonsDeclineCancel',
  onClick: function () {
    this.props.isDecliningState.requestChange(!this.props.isDecliningState.value);

    Intercom('trackEvent', 'canceled-employer-participants-decline', {
      employer_id: this.props.employerId,
      employer_name: this.props.employerName,
      participant_names: this.props.participantNames
    });
  },

  render: function () {
    return (
      React.DOM.div({className: 'btn-group clearfix'},
        React.DOM.input({className: 'btn btn-danger', type: 'submit', value: 'Decline'}),
        React.DOM.button({className: 'btn btn-default', onClick: this.onClick}, 'Cancel')
      )
    );
  }
});

var OnReviewParticipantGroupPanelFooter = React.createClass({displayName: 'OnReviewParticipantGroupPanelFooter',
  render: function() {
    var isOfferingState = this.props.isOfferingState,
        isDecliningState = this.props.isDecliningState,
        draftJobOfferValidState = this.props.draftJobOfferValidState,
        footerName = this.props.data.name + (this.props.data.program != null ? ' - ' + this.props.data.program.name : ''),
        buttonGroup = (function (participant) {
          if (isOfferingState.value) {
            return OnReviewParticipantGroupPanelFooterButtonsConfirmCancel({data: participant, employerId: this.props.employerId, employerName: this.props.employerName, participantNames: this.props.participantNames, draftJobOfferValidState: draftJobOfferValidState, isOfferingState: isOfferingState});
          } else if (isDecliningState.value) {
            return OnReviewParticipantGroupPanelFooterButtonsDeclineCancel({data: participant, employerId: this.props.employerId, employerName: this.props.employerName, participantNames: this.props.participantNames, isDecliningState: isDecliningState});
          } else {
            return OnReviewParticipantGroupPanelFooterButtonsOfferDecline({data: participant, employerId: this.props.employerId, employerName: this.props.employerName, participantNames: this.props.participantNames, isOfferingState: isOfferingState, isDecliningState: isDecliningState});
          }
        }.bind(this))(),
        legalese = (function () {
          if (isOfferingState.value) {
            return (
              React.DOM.small(null,
                'By clicking offer I agree that the information entered is true and accurate to the best of my knowledge and that I will contact InterExchange if any information changes.'
              )
            );
          } else if (isDecliningState.value) {
            return React.DOM.span(null, 'Are you sure you want to decline this participant?');
          }
        })();

    return (
      ParticipantGroupPanelFooter({name: footerName},
        buttonGroup,
        legalese
      )
    );
  }
});

var OnReviewParticipantGroupPanel = React.createClass({displayName: 'OnReviewParticipantGroupPanel',
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      isOffering: false,
      isDeclining: false,
      draftJobOfferValid: false
    };
  },

  participantNames: function () {
    return this.props.data.participants.map(function (participant) {
      return participant.name;
    }).join(', ');
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var form = $(event.target),
        data = null,
        trackEventName = null,
        url = null;

    if (this.state.isOffering) {
      url = '/offered_participant_groups.json';
      trackEventName = 'confirmed-employer-participants-offer';
      data = {
        offered_participant_group: $.extend({
          employer_id: this.props.employerId,
          on_review_participant_group_id: this.props.data.id
        }, form.serializeJSON())
      };
    } else if (this.state.isDeclining) {
      url = '/on_review_participant_groups/' + this.props.data.id + '.json';
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
      success: function(data) {
        this.setState({status: data.status});

        Intercom('trackEvent', trackEventName, {
          employer_id: this.props.employerId,
          employer_name: this.props.employerName,
          participant_names: this.participantNames()
        });
      }.bind(this),
      error: function(data) {
        console.log(data);
      }
    });
  },

  render: function() {
    var isOfferingState         = this.linkState('isOffering'),
        isDecliningState        = this.linkState('isDeclining'),
        draftJobOfferValidState = this.linkState('draftJobOfferValid');

    if (this.state.status) {
      var status = this.state.status;
      return Alert({type: status.type, message: status.message, instructions: status.instructions, actionTitle: status.action.title, actionUrl: status.action.url});
    } else {
      return (
        React.DOM.form({className: 'panel panel-default participant-group-panel form-horizontal', role: 'form', onSubmit: this.handleSubmit},
          OnReviewParticipantGroupPanelHeading({data: this.props.data}),
          OnReviewParticipantGroupPanelListGroup({data: this.props.data, isOfferingState: isOfferingState, isDecliningState: isDecliningState, draftJobOfferValidState: draftJobOfferValidState}),
          OnReviewParticipantGroupPanelFooter({data: this.props.data, employerId: this.props.employerId, employerName: this.props.employerName, participantNames: this.participantNames(), isOfferingState: isOfferingState, isDecliningState: isDecliningState, draftJobOfferValidState: draftJobOfferValidState})
        )
      );
    }
  }
});

var OnReviewParticipantGroupPanels = React.createClass({displayName: 'OnReviewParticipantGroupPanels',
  getInitialState: function () {
    return {
      groups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data.on_review_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId;
      var employerName = this.props.employerName;

      return (
        React.DOM.div({id: 'participant-group-panels'},
          this.state.groups.map(function (group) {
            return OnReviewParticipantGroupPanel({key: group.id, data: group, employerId: employerId, employerName: employerName});
          })
        )
      );
    } else {
      return Spinner(null);
    }
  }
});

module.exports = OnReviewParticipantGroupPanels;
