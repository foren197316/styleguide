/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let OnReviewParticipantGroupPanel = React.createFactory(require('./OnReviewParticipantGroupPanel'));
let OnReviewParticipantGroupStore = require('../stores/OnReviewParticipantGroupStore');
let EmployerStore = require('../stores/EmployerStore');
let PositionStore = require('../stores/PositionStore');
let { RenderLoadedMixin } = require('../mixins');
let { OnReviewParticipantGroupActions, PositionActions, loadFromOnReviewParticipantGroups } = require('../actions');

let OnReviewParticipantGroupPanels = React.createClass({
  displayName: 'OnReviewParticipantGroupPanels',
  mixins: [
    Reflux.connect(OnReviewParticipantGroupStore, 'onReviewParticipantGroups'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(PositionStore, 'positions'),
    RenderLoadedMixin('onReviewParticipantGroups', 'employers', 'positions')
  ],

  getInitialState () {
    return { groups: [] };
  },

  componentDidMount () {
    OnReviewParticipantGroupActions.ajaxLoad(loadFromOnReviewParticipantGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded () {
    return (
      React.DOM.div({id: 'participant-group-panels'},
        this.state.onReviewParticipantGroups.map((onReviewParticipantGroup, key) => {
          let employer = this.state.employers.findById(onReviewParticipantGroup.employer_id);
          let { positions } = this.state;
          return OnReviewParticipantGroupPanel({key, data: onReviewParticipantGroup, employerId: employer.id, employerName: employer.name, positions});
        })
      )
    );
  }
});

module.exports = OnReviewParticipantGroupPanels;
