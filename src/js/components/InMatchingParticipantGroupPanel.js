/* @flow */
'use strict';

let React = require('react/addons');
let dateFormatMDY = require('../globals').dateFormatMDY;
let actions = require('../actions');
let Alert = require('./Alert');
let ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
let ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
let moment = require('moment');
let ParticipantGroupHeader = require('./ParticipantGroupHeader');

let InMatchingParticipantGroupPanel = React.createClass({displayName: 'InMatchingParticipantGroupPanel',
  propTypes: {
    employer: React.PropTypes.object.isRequired,
    enrollment: React.PropTypes.object.isRequired,
    inMatchingParticipantGroup: React.PropTypes.object.isRequired,
    program: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      sending: false,
      puttingOnReview: false,
      onReviewExpiresOn: moment().add(3, 'days').format(dateFormatMDY)
    };
  },

  canPutOnReview () {
    return this.props.enrollment.on_review_count < this.props.enrollment.on_review_maximum &&
           this.props.inMatchingParticipantGroup.participants.length <= (this.props.enrollment.on_review_maximum - this.props.enrollment.on_review_count);
  },

  handlePutOnReview () {
    this.setState({ puttingOnReview: true });

    global.Intercom('trackEvent', 'clicked-employer-participants-review', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.participantNames()
    });
  },

  handleCancel () {
    this.setState({ puttingOnReview: false });

    global.Intercom('trackEvent', 'canceled-employer-participants-review', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.participantNames()
    });
  },

  handleConfirm () {
    this.setState({ sending: true });

    actions.InMatchingParticipantGroupActions.offer(
      this.props.inMatchingParticipantGroup,
      this.props.employer,
      this.props.enrollment,
      this.state.onReviewExpiresOn,
      (data) => {
        this.setState({status: data.status});

        global.Intercom('trackEvent', 'confirmed-employer-participants-review', {
          employer_id: this.props.employer.id,
          employer_name: this.props.employer.name,
          participant_names: this.participantNames()
        });
      }
    );
  },

  participantNames () {
    return this.props.inMatchingParticipantGroup.participants.mapAttribute('name').join(', ');
  },

  render () {
    let action;
    let legalese;
    let participantPluralized = this.props.inMatchingParticipantGroup.participants.length > 1 ?
      'participants' :
      'participant';

    if (this.state.status) {
      let status = this.state.status;
      return React.createElement(Alert, {type: status.type, message: status.message, instructions: status.instructions, actionTitle: status.action.title, actionUrl: status.action.url});
    } else {
      if (this.state.puttingOnReview) {
        action = (
          React.DOM.div({className: 'btn-group pull-right'},
            React.DOM.button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
            React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
          )
        );
        legalese = (
          React.DOM.div({},
            React.DOM.p({className: 'panel-text'}, 'You will have until ', React.DOM.strong({}, this.state.onReviewExpiresOn), ' to offer a position or decline the ', participantPluralized, '.'),
            React.DOM.p({className: 'panel-text'}, 'If you take no action by ', React.DOM.strong({}, this.state.onReviewExpiresOn), ', the ', participantPluralized, ' will automatically be removed from your On Review list.')
          )
        );
      } else if (this.canPutOnReview()) {
        action = React.DOM.button({className: 'btn btn-success pull-right', onClick: this.handlePutOnReview}, 'Put on Review');
      } else {
        action = React.DOM.span({className: 'label label-warning'}, 'On Review limit reached');
      }

      return (
        React.DOM.div({className: 'panel panel-default participant-group-panel', 'data-participant-names': this.participantNames()},
          React.createElement(ParticipantGroupHeader, {},
            React.DOM.div({}, this.props.program.name)
          ),
          React.DOM.div({className: 'list-group'},
            this.props.inMatchingParticipantGroup.participants.map(function (participant) {
              return React.createElement(ParticipantGroupParticipant, {key: participant.id, participant: participant});
            })
          ),
          React.createElement(ParticipantGroupPanelFooter, {name: this.props.inMatchingParticipantGroup.name},
            action,
            legalese
          )
        )
      );
    }
  }
});

module.exports = InMatchingParticipantGroupPanel;
