var JobOfferGroupsPanel = React.createClass({displayName: 'JobOfferGroupsPanel',
  mixins: [
    Reflux.connect(JobOfferGroupStore, 'jobOfferGroups'),
    Reflux.connect(ProgramStore, 'programs'),
    Reflux.connect(PositionStore, 'positions'),
    Reflux.connect(EmployerStore, 'employers'),
    Reflux.connect(StaffStore, 'staffs'),
    RenderLoadedMixin('jobOfferGroups', 'programs', 'positions', 'employers', 'staffs')
  ],

  componentDidMount: function () {
    JobOfferGroupActions.ajaxLoad(GlobalActions.loadFromJobOfferGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      React.DOM.div({id: 'participant-group-panels'},
        this.state.programs.map(function (program) {
          var programJobOfferGroups = this.state.jobOfferGroups.filter(function (jobOfferGroup) {
            return jobOfferGroup.program_id === program.id;
          });

          if (programJobOfferGroups.length > 0) {
            return (
              React.DOM.div(null,
                ProgramHeader({program: program, collectionName: 'Job Offer', collection: programJobOfferGroups.mapAttribute('job_offers')}),
                programJobOfferGroups.map(function (jobOfferGroup) {
                  return JobOfferGroup({jobOfferGroup: jobOfferGroup, key: 'program_job_offer_group'+program.id+'-'+jobOfferGroup.id});
                })
              )
            );
          }
        }, this)
      )
    );
  }
});
