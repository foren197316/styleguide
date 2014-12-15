var JobOffersIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      signedAllUnselected: true,
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
      .then(this.extractIds("job_offer_participant_agreement_id"))
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

  renderLoaded: function () {
    var programs = this.state.programs;
    var jobOffers = this.state.jobOffers;
    var participants = this.state.participants;
    var employers = this.state.employers;
    var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements;
    var signedAllUnselected = this.state.signedAllUnselected;
    var jobOfferFileMakerReferences = this.state.jobOfferFileMakerReferences;
    var jobOfferFileMakerReferenceUnselected = this.state.jobOfferFileMakerReferenceUnselected;

    var jobOfferFileMakerReferenceLink = this.linkState("jobOfferFileMakerReference");
    var jobOfferFileMakerReferenceUnselectedLink = this.linkState("jobOfferFileMakerReferenceUnselected");

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn={["name", "email", "uuid"]} options={this.props.participants} dataLink={this.linkState("participants")} />
          <CheckBoxFilter title="Job Offers" options={this.props.signed} dataLink={this.linkState("signed")} allUnselectedLink={this.linkState("signedAllUnselected")} />
          <CheckBoxFilter title="FileMaker Reference" options={this.props.jobOfferFileMakerReference} dataLink={jobOfferFileMakerReferenceLink} allUnselectedLink={jobOfferFileMakerReferenceUnselectedLink} />
        </div>
        <div className="col-md-9">
          <div id="job-offer-panels">
            {programs.map(function (program) {
              var programParticipants = participants.filter(function (participant) {
                if (participant.program_id !== program.id) {
                  return false;
                }

                var jobOffer = jobOffers.findById(participant.id, "participant_id");

                if (!signedAllUnselected) {
                  if (!jobOfferParticipantAgreements.findById(jobOffer.id, "job_offer_id")) {
                    return false;
                  }
                }

                if (!jobOfferFileMakerReferenceUnselected) {
                  if (jobOfferFileMakerReferences.findById(jobOffer.id, "job_offer_id")) {
                    return false;
                  }
                }

                return true;
              });

              if (programParticipants.length === 0) {
                return;
              }

              return (
                <div className="programs" key={"in_matching_participant_group_program_"+program.id}>
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="page-header">
                        {program.name}
                        <small className="pull-right">{programParticipants.length} Participants</small>
                      </h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div id="job-offer-panels">
                        {jobOffers.findById(programParticipants.mapAttribute("id"), "participant_id").map(function (jobOffer) {
                          var participant = programParticipants.findById(jobOffer.participant_id);
                          var jobOfferParticipantAgreement = jobOfferParticipantAgreements.findById(jobOffer.id, "job_offer_id");

                          return (
                            <JobOfferPanel
                              key={"job_offer" + jobOffer.id}
                              participant={participant}
                              jobOffer={jobOffer}
                              jobOfferParticipantAgreement={jobOfferParticipantAgreement}
                              program={program} />
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
