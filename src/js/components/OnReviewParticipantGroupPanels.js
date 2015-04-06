/* @flow */
'use strict';

let React = require('react/addons');
let Reflux = require('reflux');
let ReloadingComponent = React.createFactory(require('./ReloadingComponent'));
let Pagination = React.createFactory(require('./Pagination'));
let OnReviewParticipantGroupPanel = React.createFactory(require('./OnReviewParticipantGroupPanel'));
let OnReviewParticipantGroupStore = require('../stores/OnReviewParticipantGroupStore');
let AjaxSearchForm = React.createFactory(require('./AjaxSearchForm'));
let AjaxSearchFilter = React.createFactory(require('./AjaxSearchFilter'));
let AjaxCheckBoxFilter = React.createFactory(require('./AjaxCheckBoxFilter'));
let EmployerStore = require('../stores/EmployerStore');
let PositionStore = require('../stores/PositionStore');
let MetaStore = require('../stores/MetaStore');
let ProgramStore = require('../stores/ProgramStore');
let StaffStore = require('../stores/StaffStore');
let { RenderLoadedMixin } = require('../mixins');
let {
  OnReviewParticipantGroupActions,
  PositionActions,
  loadFromOnReviewParticipantGroups
} = require('../actions');
let { getQuery, getCurrentPage } = require('../query');
let { div, a } = React.DOM;

let OnReviewParticipantGroupPanels = React.createClass({
  displayName: 'OnReviewParticipantGroupPanels',
  mixins: [
    React.addons.LinkedStateMixin,
    Reflux.connect(OnReviewParticipantGroupStore, 'onReviewParticipantGroups'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(MetaStore, 'meta'),
    RenderLoadedMixin('onReviewParticipantGroups', 'employers', 'positions', 'meta')
  ],

  getInitialState () {
    return {
      formSending: false
    };
  },

  componentDidMount () {
    if (!this.state.onReviewParticipantGroups) {
      let query = getQuery();
      if (query) {
        OnReviewParticipantGroupActions.ajaxSearch(getQuery(), loadFromOnReviewParticipantGroups);
      } else {
        let {
          on_review_participant_groups:onReviewParticipantGroups,
          employers,
          meta,
          programs,
          staffs
        } = (global.INITIAL_DATA || {});

        OnReviewParticipantGroupStore.set(onReviewParticipantGroups);
        EmployerStore.set(employers);
        MetaStore.set(meta);
        ProgramStore.set(programs);
        StaffStore.set(staffs);
      }

      PositionActions.ajaxLoad();
    }
  },

  renderLoaded () {
    let { positions, employers, meta, onReviewParticipantGroups } = this.state;
    let formSending = this.linkState('formSending');
    let recordName = 'Participant';
    let anchor = 'searchTop';
    let page = getCurrentPage();
    let { pageCount, recordCount } = meta;
    let callbacks = [loadFromOnReviewParticipantGroups];
    let searchOn = ['participants_name', 'participants_email', 'participants_deprecated_wt_participant_application_uuid'];

    return (
      div({className: 'row'},
        div({className: 'col-md-3'},
          AjaxSearchForm({ formSending, actions: OnReviewParticipantGroupActions, callbacks },
            AjaxSearchFilter({ title: 'Search', searchOn }),
            AjaxCheckBoxFilter({title: 'Program', store: ProgramStore, fieldName: 'participants_program_id'}),
            AjaxCheckBoxFilter({title: 'Coordinator', fieldName: 'employer_staff_id', store: StaffStore})
          )
        ),
        div({className: 'col-md-9'},
          div({id: 'participant-group-panels'},
            a({ name: anchor }),
            ReloadingComponent({ loadingLink: formSending },
              div({className: 'row'},
                div({className: 'col-md-12'},
                  Pagination({ pageCount, recordCount, page, actions: OnReviewParticipantGroupActions, formSending, recordName, callbacks })
                )
              ),
              onReviewParticipantGroups.map((onReviewParticipantGroup, key) => {
                let employer = employers.findById(onReviewParticipantGroup.employer_id);
                if (employer) {
                  return OnReviewParticipantGroupPanel({key, onReviewParticipantGroup, employer, positions});
                }
              }),
              div({className: 'row'},
                div({className: 'col-md-12'},
                  Pagination({ pageCount, recordCount, page, anchor, actions: OnReviewParticipantGroupActions, formSending, recordName, callbacks })
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = OnReviewParticipantGroupPanels;
