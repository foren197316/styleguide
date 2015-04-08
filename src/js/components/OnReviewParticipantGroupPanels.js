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
let CreatedByUserTypeStore = require('../stores/CreatedByUserTypeStore');
let MetaStore = require('../stores/MetaStore');
let ProgramStore = require('../stores/ProgramStore');
let StaffStore = require('../stores/StaffStore');
let LoadingStore = require('../stores/LoadingStore');
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
    Reflux.connect(OnReviewParticipantGroupStore, 'onReviewParticipantGroups'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(MetaStore, 'meta'),
    Reflux.connect(LoadingStore, 'isLoading'),
    RenderLoadedMixin('onReviewParticipantGroups', 'employers', 'positions', 'meta')
  ],

  getInitialState () {
    return {
      isLoading: false
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
    let { positions, employers, meta, onReviewParticipantGroups, isLoading } = this.state;
    let recordName = 'Participant';
    let anchor = 'searchTop';
    let page = getCurrentPage();
    let { pageCount, recordCount } = meta;
    let callbacks = [loadFromOnReviewParticipantGroups];
    let searchOn = ['participants_name', 'participants_email', 'participants_deprecated_wt_participant_application_uuid'];

    return (
      div({className: 'row'},
        div({className: 'col-md-3'},
          AjaxSearchForm({ actions: OnReviewParticipantGroupActions, callbacks },
            AjaxSearchFilter({ title: 'Search', searchOn }),
            AjaxCheckBoxFilter({title: 'Program', store: ProgramStore, fieldName: 'participants_program_id'}),
            AjaxCheckBoxFilter({title: 'Coordinator', fieldName: 'employer_staff_id', store: StaffStore}),
            AjaxCheckBoxFilter({title: 'Employer', fieldName: 'employer_id', store: EmployerStore}),
            AjaxCheckBoxFilter({title: 'Put On Review By', fieldName: 'created_by_type', store: CreatedByUserTypeStore})
          )
        ),
        div({className: 'col-md-9'},
          div({id: 'participant-group-panels'},
            a({ name: anchor }),
            ReloadingComponent({ isLoading },
              div({className: 'row'},
                div({className: 'col-md-12'},
                  Pagination({ pageCount, recordCount, page, actions: OnReviewParticipantGroupActions, recordName, callbacks })
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
                  Pagination({ pageCount, recordCount, page, anchor, actions: OnReviewParticipantGroupActions, recordName, callbacks })
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
