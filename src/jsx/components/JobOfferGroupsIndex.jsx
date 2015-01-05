var JobOfferGroupsIndex = React.createClass({
  mixins: [
    Reflux.connect(JobOfferGroupStore, "jobOfferGroups"),
    Reflux.connect(ProgramStore, "programs"),
    RenderLoadedMixin(["jobOfferGroups", "programs"])
  ],

  componentDidMount: function () {
    window.RESOURCE_URLS = this.props.urls;
    JobOfferGroupActions.ajaxLoad();
    ProgramActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn="participant_names" actions={JobOfferGroupActions} />
          <BooleanFilter title="Participant Agreement" label="All Signed" action={JobOfferGroupActions.toggleAllSigned} />
        </div>
        <div className="col-md-9">
          <div id="participant-group-panels">
            {this.state.programs.map(function (program) {
              var programJobOfferGroups = this.state.jobOfferGroups.filter(function (jobOfferGroup) {
                return jobOfferGroup.program_id === program.id;
              });

              if (programJobOfferGroups.length > 0) {
                return (
                  <div>
                    <ProgramHeader program={program} collectionName="Job Offer" collection={programJobOfferGroups.mapAttribute("job_offers")} />
                    {programJobOfferGroups.map(function (jobOfferGroup) {
                      return <JobOfferGroup jobOfferGroup={jobOfferGroup} />
                    })}
                  </div>
                )
              }
            }, this)}
          </div>
        </div>
      </div>
    )
  }
});
