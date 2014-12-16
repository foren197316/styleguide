var JobOffersIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      jobOfferParticipantSignedUnselected: true,
      jobOfferFileMakerReferenceUnselected: true,
      signed: [
        { id: "true", name: "Participant Signed" }
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

    this.loadAll([
      programsPromise,
      employersPromise,
      jobOfferParticipantAgreementsPromise,
      jobOfferFileMakerReferencesPromise
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

      if (!this.state.jobOfferParticipantSignedUnselected) {
        jobOffers = jobOffers.findById(jobOfferParticipantAgreements.mapAttribute("job_offer_id"));
      }

      if (!this.state.jobOfferFileMakerReferenceUnselected) {
        jobOffers = jobOffers.diff(jobOffers.findById(jobOfferFileMakerReferences.mapAttribute("job_offer_id")));
      }

      if (jobOffers.length === 0) {
        return null;
      }

      return {
        program: program,
        participants: participants,
        jobOffers: jobOffers,
        jobOfferParticipantAgreements: jobOfferParticipantAgreements,
        jobOfferFileMakerReferences: jobOfferFileMakerReferences
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
    var jobOfferIds = programsJobOffersCache.map(function (cache) { return cache.jobOffers }).flatten().mapAttribute("id")

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn={["name", "email", "uuid"]} options={this.props.participants} dataLink={this.linkState("participants")} />
          <CheckBoxFilter title="Job Offers" options={this.props.signed} dataLink={this.linkState("signed")} allUnselectedLink={this.linkState("jobOfferParticipantSignedUnselected")} />
          <CheckBoxFilter title="FileMaker Reference" options={this.props.jobOfferFileMakerReference} dataLink={jobOfferFileMakerReferenceLink} allUnselectedLink={jobOfferFileMakerReferenceUnselectedLink} />
          <ExportButton url={this.props.urls.export} ids={jobOfferIds} />
        </div>
        <div className="col-md-9">
          <div id="job-offer-panels">
            {programsJobOffersCache.map(function (cache) {
              return (
                <div className="programs" key={"in_matching_participant_group_program_"+cache.program.id}>
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="page-header">
                        {cache.program.name}
                        <small className="pull-right">{cache.participants.length} Participants</small>
                      </h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div id="job-offer-panels">
                        {cache.jobOffers.map(function (jobOffer) {
                          var participant = cache.participants.findById(jobOffer.participant_id);
                          var jobOfferParticipantAgreement = cache.jobOfferParticipantAgreements.findById(jobOffer.id, "job_offer_id");
                          var jobOfferFileMakerReference = cache.jobOfferFileMakerReferences.findById(jobOffer.id, "job_offer_id");

                          return (
                            <JobOfferPanel
                              key={"job_offer" + jobOffer.id}
                              participant={participant}
                              jobOffer={jobOffer}
                              jobOfferParticipantAgreement={jobOfferParticipantAgreement}
                              program={cache.program} />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },

  render: function () {
    return this.waitForLoadAll(this.renderLoaded);
  }
});

var JobOfferPanel = React.createClass({
  propTypes: {
    jobOffer: React.PropTypes.object.isRequired,
    participant: React.PropTypes.object.isRequired,
    program: React.PropTypes.object.isRequired
  },

  render: function () {
    /**
     * TODO: Refactor so that there's no ParticipantGroup specific stuff
     */
    return (
      <div className="panel panel-default job-offer-panel">
        <div className="list-group">
          <ParticipantGroupParticipant key={this.props.participant.id} data={this.props.participant} />
        </div>
        <ParticipantGroupPanelFooter name={this.props.jobOfferParticipantAgreement ? "Agreement Signed" : "Unsigned"} />
      </div>
    )
  }
});
