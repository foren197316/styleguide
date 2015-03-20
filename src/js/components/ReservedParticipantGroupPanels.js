/* @flow */
'use strict';

let axios = require('axios');
let ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');
let ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
let React = require('react/addons');
let Spinner = require('./Spinner');
let { dateFormatMDY } = require('../globals');
let moment = require('moment');

var ReservedParticipantGroupPanel = React.createClass({displayName: 'ReservedParticipantGroupPanel',
  propTypes: {
    data: React.PropTypes.object.isRequired,
    employerId: React.PropTypes.string
  },

  getInitialState () {
    return { sending: false, puttingOnReview: false };
  },

  handlePutOnReview () {
    this.setState({ puttingOnReview: true });
  },

  handleCancel () {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm () {
    this.setState({ sending: true });

    let data = {
          on_review_participant_group: {
            employer_id: this.props.employerId,
            expires_on: moment().add(3, 'days').format(dateFormatMDY),
            unmatched_participant_group_id: this.props.data.id
          }
        };

    axios({
      url: '/on_review_participant_groups.json',
      method: 'post',
      data
    })
    .then(() => {
      let node = this.getDOMNode();
      React.unmountComponentAtNode(node);
      node.remove();
    }, () => {
      global.location = global.location;
    });
  },

  render () {
    var actions, additionalContent;
    let footerName = this.props.data.name;
    let participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant';
    let participantNodes = this.props.data.participants.map(participant => (
          React.createElement(ParticipantGroupParticipant, {key: participant.id, participant: participant})
        ));

    if (this.state.puttingOnReview) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );

      additionalContent = (
        React.DOM.div({},
          React.DOM.p({className: 'panel-text'}, 'You will have until ', React.DOM.strong({}, this.props.onReviewExpiresOn), ' to offer a position or decline the ', participantPluralized, '.'),
          React.DOM.p({className: 'panel-text'}, 'If you take no action by ', React.DOM.strong({}, this.props.onReviewExpiresOn), ', the ', participantPluralized, ' will automatically be removed from your On Review list.')
        )
      );
    } else {
      actions = (
        React.DOM.button({className: 'btn btn-success', onClick: this.handlePutOnReview}, 'Put on Review')
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.DOM.div({className: 'list-group'},
          participantNodes
        ),
        React.createElement(ParticipantGroupPanelFooter, {name: footerName},
          actions,
          additionalContent
        )
      )
    );
  }
});

module.exports = React.createClass({displayName: 'ReservedParticipantGroupPanels',
  propTypes: {
    source: React.PropTypes.string.isRequired
  },

  getInitialState () {
    return {
      groups: []
    };
  },

  componentDidMount() {
    axios({
      url: this.props.source,
      method: 'get'
    })
    .then(response => {
      if (this.isMounted()) {
        this.setState({
          groups: response.data.reserved_participant_groups
        });
      }
    });
  },

  render () {
    if (this.isMounted()) {
      let employerId = this.props.employerId;

      return (
        React.DOM.div({id: 'participant-group-panels'},
          this.state.groups.map(group => (
            React.createElement(ReservedParticipantGroupPanel, {key: group.id, data: group, employerId: employerId})
          ))
        )
      );
    } else {
      return React.createElement(Spinner, {});
    }
  }
});
