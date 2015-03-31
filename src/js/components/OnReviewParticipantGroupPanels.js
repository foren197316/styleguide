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
let { getQuery } = require('../query');

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
    OnReviewParticipantGroupActions.ajaxSearch(getQuery(), loadFromOnReviewParticipantGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded () {
    let { positions } = this.state;

    return (
      React.DOM.div({id: 'participant-group-panels'},
        this.state.onReviewParticipantGroups.map((onReviewParticipantGroup, key) => {
          let employer = this.state.employers.findById(onReviewParticipantGroup.employer_id);
          return OnReviewParticipantGroupPanel({key, onReviewParticipantGroup, employer, positions});
        })
      )
    );
  }
});

module.exports = OnReviewParticipantGroupPanels;
