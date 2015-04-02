/* @flow */
'use strict';

let React = require('react/addons');
let axios = require('axios');
let ParticipantGroupPanelFooter = React.createFactory(require('./ParticipantGroupPanelFooter'));
let ParticipantGroupParticipant = React.createFactory(require('./ParticipantGroupParticipant'));
let Spinner = React.createFactory(require('./Spinner'));
let { dateFormatMDY } = require('../globals');
let moment = require('moment');
let { div, button, p, strong } = React.DOM;

let ReservedParticipantGroupPanel = React.createFactory(React.createClass({
  displayName: 'ReservedParticipantGroupPanel',
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

    if (this.state.puttingOnReview) {
      actions = (
        div({className: 'btn-group'},
          button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );

      additionalContent = (
        div({},
          p({className: 'panel-text'}, 'You will have until ', strong({}, this.props.onReviewExpiresOn), ' to offer a position or decline the ', participantPluralized, '.'),
          p({className: 'panel-text'}, 'If you take no action by ', strong({}, this.props.onReviewExpiresOn), ', the ', participantPluralized, ' will automatically be removed from your On Review list.')
        )
      );
    } else {
      actions = (
        button({className: 'btn btn-success', onClick: this.handlePutOnReview}, 'Put on Review')
      );
    }

    return (
      div({className: 'panel panel-default participant-group-panel'},
        div({className: 'list-group'},
          this.props.data.participants.map(participant => (
            ParticipantGroupParticipant({key: participant.id, participant: participant})
          ))
        ),
        ParticipantGroupPanelFooter({name: footerName},
          actions,
          additionalContent
        )
      )
    );
  }
}));

let ReservedParticipantGroupPanels = React.createClass({
  displayName: 'ReservedParticipantGroupPanels',
  propTypes: {
    source: React.PropTypes.string.isRequired
  },

  getInitialState () {
    return {
      groups: []
    };
  },

  componentDidMount () {
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
        div({id: 'participant-group-panels'},
          this.state.groups.map(group => (
            ReservedParticipantGroupPanel({key: group.id, data: group, employerId: employerId})
          ))
        )
      );
    } else {
      return Spinner();
    }
  }
});

module.exports = ReservedParticipantGroupPanels;
