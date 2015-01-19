/* exported JobOfferGroupsIndex */
'use strict';

var SetUrlsMixin = require('../mixins').SetUrlsMixin;

var JobOfferGroupsIndex = React.createClass({displayName: 'JobOfferGroupsIndex',
  mixins: [SetUrlsMixin],

  render: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-md-3'},
          SearchFilter({title: 'Search', searchOn: 'participant_names', actions: JobOfferGroupActions}),
          CheckBoxFilter({title: 'Participant Agreement', store: JobOfferSignedStore, actions: JobOfferSignedActions}),
          CheckBoxFilter({title: 'Program', store: ProgramStore, actions: ProgramActions}),
          CheckBoxFilter({title: 'Employer', store: EmployerStore, actions: EmployerActions}),
          CheckBoxFilter({title: 'Coordinator', store: StaffStore, actions: StaffActions})
        ),
        React.DOM.div({className: 'col-md-9'},
          JobOfferGroupsPanel(null)
        )
      )
    );
  }
});

module.exports = JobOfferGroupsIndex;
