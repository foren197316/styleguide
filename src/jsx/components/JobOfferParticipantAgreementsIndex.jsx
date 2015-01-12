var JobOfferParticipantAgreementsIndex = React.createClass({
  mixins: [
    SetUrlsMixin,
    Reflux.connect(JobOfferParticipantAgreementStore, "jobOfferParticipantAgreements")
  ],

  render: function () {
    var jobOfferIds = this.state.jobOfferParticipantAgreements
      ? this.state.jobOfferParticipantAgreements.mapAttribute("job_offer").mapAttribute("id")
      : [];
    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn={[["job_offer", "participant", "name"], ["job_offer", "participant", "email"], ["job_offer", "participant", "uuid"]]} actions={JobOfferParticipantAgreementActions} />
          <CheckBoxFilter title="Program" store={ProgramStore} actions={ProgramActions} />
          <BooleanFilter title="FileMaker" label="Not in FileMaker" action={JobOfferParticipantAgreementStore.toggleNotInFileMaker} />
          <ExportButton url={this.props.urls.export} ids={jobOfferIds} />
        </div>
        <div className="col-md-9">
          <JobOfferParticipantAgreementsPanel />
        </div>
      </div>
    )
  }
});
