var JobOfferGroupsPanel = React.createClass({
  mixins: [
    Reflux.connect(JobOfferGroupStore, "jobOfferGroups"),
    Reflux.connect(ProgramStore, "programs"),
    Reflux.connect(PositionStore, "positions"),
    RenderLoadedMixin("jobOfferGroups", "programs", "positions")
  ],

  propTypes: {
    urls: React.PropTypes.array.isRequired
  },

  componentDidMount: function () {
    window.RESOURCE_URLS = this.props.urls;
    JobOfferGroupActions.ajaxLoad(GlobalActions.loadFromJobOfferGroups);
    PositionActions.ajaxLoad();
  },

  renderLoaded: function () {
    return (
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
    )
  }
});
