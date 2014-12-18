var JobOffersIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      jobOfferParticipantSignedUnselected: true,
      jobOfferFileMakerReferenceUnselected: true,
      signed: [
        { id: "true", name: "Signed" }
      ],
      jobOfferFileMakerReference: [
        { id: "false", name: "Not in FileMaker" }
      ]
    };
  },

  componentDidMount: function () {
    var jobOffersPromise = this.loadResource("jobOffers")();

    var programsPromise =
      jobOffersPromise
      .then(this.extractIds("participant_id"))
      .then(this.loadResource("participants"))
      .then(this.extractIds("program_id"))
      .then(this.loadResource("programs"));

    var employersPromise =
      jobOffersPromise
      .then(this.extractIds("employer_id"))
      .then(this.loadResource("employers"));

    var jobOfferParticipantAgreementsPromise =
      jobOffersPromise
      .then(this.extractIds("participant_agreement_id"))
      .then(this.loadResource("jobOfferParticipantAgreements"));

    var jobOfferFileMakerReferencesPromise =
      jobOffersPromise
      .then(this.extractIds("file_maker_reference_id"))
      .then(this.loadResource("jobOfferFileMakerReferences"));

    var positionsPromise =
      jobOffersPromise
      .then(this.extractIds("position_id"))
      .then(this.loadResource("positions"));

    this.loadAll([
      programsPromise,
      employersPromise,
      jobOfferParticipantAgreementsPromise,
      jobOfferFileMakerReferencesPromise,
      positionsPromise
    ]).done(this.afterLoad);
  },

  afterLoad: function () {
    this.setProps({
      participants: this.state.participants,
      signed: this.state.signed,
      jobOfferFileMakerReference: this.state.jobOfferFileMakerReference
    });
  },

  getProgramsJobOffersCache: function () {
    return this.state.programs.map(function (program) {
      var participants = this.state.participants.filter(function (participant) { return participant.program_id === program.id });
      var jobOffers = this.state.jobOffers.findById(participants.mapAttribute("id"), "participant_id");
      var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements.findById(jobOffers.mapAttribute("id"), "job_offer_id");
      var jobOfferFileMakerReferences = this.state.jobOfferFileMakerReferences.findById(jobOffers.mapAttribute("id"), "job_offer_id");
      var positions = this.state.positions.findById(jobOffers.mapAttribute("position_id"));

      if (!this.state.jobOfferParticipantSignedUnselected) {
        jobOffers = jobOffers.findById(jobOfferParticipantAgreements.mapAttribute("job_offer_id"));
      }

      if (!this.state.jobOfferFileMakerReferenceUnselected) {
        jobOffers = jobOffers.diff(jobOffers.findById(jobOfferFileMakerReferences.mapAttribute("job_offer_id")));
      }

      if (jobOffers.length === 0) {
        return null;
      }

      participants = participants.findById(jobOffers.mapAttribute("participant_id"));

      return {
        jobOffers: jobOffers,
        jobOfferParticipantAgreements: jobOfferParticipantAgreements,
        jobOfferFileMakerReferences: jobOfferFileMakerReferences,
        participants: participants,
        positions: positions,
        program: program
      }
    }.bind(this)).filter(function (cache) {
      return cache !== null;
    });
  },

  renderLoaded: function () {
    var programs = this.state.programs;
    var jobOffers = this.state.jobOffers;
    var participants = this.state.participants;
    var employers = this.state.employers;
    var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements;
    var jobOfferParticipantSignedUnselected = this.state.jobOfferParticipantSignedUnselected;
    var jobOfferFileMakerReferences = this.state.jobOfferFileMakerReferences;
    var jobOfferFileMakerReferenceUnselected = this.state.jobOfferFileMakerReferenceUnselected;

    var jobOfferFileMakerReferenceLink = this.linkState("jobOfferFileMakerReference");
    var jobOfferFileMakerReferenceUnselectedLink = this.linkState("jobOfferFileMakerReferenceUnselected");

    var programsJobOffersCache = this.getProgramsJobOffersCache();
    var jobOfferIds = programsJobOffersCache.map(function (cache) { return cache.jobOffers }).flatten().mapAttribute("id");

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn={["name", "email", "uuid"]} options={this.props.participants} dataLink={this.linkState("participants")} />
          <CheckBoxFilter title="Participant Agreement" options={this.props.signed} dataLink={this.linkState("signed")} allUnselectedLink={this.linkState("jobOfferParticipantSignedUnselected")} />
          <CheckBoxFilter title="FileMaker Reference" options={this.props.jobOfferFileMakerReference} dataLink={jobOfferFileMakerReferenceLink} allUnselectedLink={jobOfferFileMakerReferenceUnselectedLink} />
          <ExportButton url={this.props.urls.export} ids={jobOfferIds} />
        </div>
        <div className="col-md-9">
          {programsJobOffersCache.map(function (cache) {
            return (
              <div key={"program"+cache.program.id} className="program">
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="page-header">
                      {cache.program.name}
                      <small className="pull-right">{cache.jobOffers.length} {"Job Offer".pluralize(cache.jobOffers.length)}</small>
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    {cache.jobOffers.map(function (jobOffer) {
                      var jobOfferParticipantAgreement = cache.jobOfferParticipantAgreements.findById(jobOffer.id, "job_offer_id");
                      var jobOfferFileMakerReference = cache.jobOfferFileMakerReferences.findById(jobOffer.id, "job_offer_id");
                      var participant = cache.participants.findById(jobOffer.participant_id);
                      var position = cache.positions.findById(jobOffer.position_id);

                      return (
                        <div className="participant-group-panel list-group">
                          <OfferedParticipantGroupParticipant key={"participant_" + participant.id}
                            participant={participant}
                            position={position}
                            offer={jobOffer}
                            jobOfferParticipantAgreement={jobOfferParticipantAgreement}
                            jobOfferFileMakerReference={jobOfferFileMakerReference}
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
  },

  render: function () {
    return this.waitForLoadAll(this.renderLoaded);
  }
});
