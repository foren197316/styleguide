var JobOffersIndex = React.createClass({
  mixins: [
    Reflux.ListenerMixin,
    Reflux.connect(JobOfferStore, "jobOffers"),
    Reflux.connect(ProgramStore, "programs"),
    RenderLoadedMixin("jobOffers", "programs")
  ],

  getInitialState: function () {
    return {};
  },

  componentDidMount: function () {
    window.RESOURCE_URLS = this.props.urls;
    JobOfferActions.deprecatedAjaxLoad(null, CONTEXT.JOB_OFFER);
  },

  renderLoaded: function () {
    var jobOffers = this.state.jobOffers;
    var jobOfferIds = jobOffers.mapAttribute("id");
    var jobOfferFileMakerReferenceFilter = JobOfferFileMakerReferenceStore.permission
      ? <BooleanFilter title="FileMaker Reference" label="Not in FileMaker" action={JobOfferActions.toggleNotInFileMaker} />
      : null;

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn={[["participant", "name"], ["participant", "email"], ["participant", "uuid"]]} actions={JobOfferActions} />
          <CheckBoxFilter title="Program" store={ProgramStore} actions={ProgramActions} />
          <CheckBoxFilter title="Coordinator" store={StaffStore} actions={StaffActions} />
          <BooleanFilter title="Participant Agreement" label="Signed" action={JobOfferActions.toggleJobOfferSigned} />
          {jobOfferFileMakerReferenceFilter}
          <ExportButton url={this.props.urls.export} ids={jobOfferIds} />
        </div>
        <div className="col-md-9">
          {programs.map(function (program) {
            var programJobOffers = jobOffers.filter(function (jobOffer) {
              return jobOffer.participant.program_id === program.id;
            });

            if (programJobOffers.length === 0) {
              return null;
            }

            return (
              <div key={"program"+program.id} className="program">
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="page-header">
                      {program.name}
                      <small className="pull-right">{programJobOffers.length} {"Job Offer".pluralize(programJobOffers.length)}</small>
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {programJobOffers.map(function (jobOffer) {
                      var position = PositionStore.findById(jobOffer.position_id);

                      return (
                        <div className="participant-group-panel list-group">
                          <OfferedParticipantGroupParticipant key={"participant_" + jobOffer.participant.id}
                            participant={jobOffer.participant}
                            position={position}
                            offer={jobOffer}
                            jobOfferParticipantAgreement={jobOffer.participant_agreement}
                            jobOfferFileMakerReference={jobOffer.file_maker_reference}
                            offerLinkTitle="View" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
});
