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
