var JobOffersIndex = React.createClass({
  mixins: [LoadResourceMixin],

  getInitialState: function () {
    return {};
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

    this.loadAll([
      programsPromise,
      employersPromise,
      jobOfferParticipantAgreementsPromise
    ]);
  },

  renderLoaded: function () {
    var programs = this.state.programs;
    var jobOffers = this.state.jobOffers;
    var participants = this.state.participants;
    var employers = this.state.employers;
    var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements;

    return (
      <div className="row">
        <div className="col-md-3">
          <div>Im the search</div>
        </div>
        <div className="col-md-9">
          <div id="job-offer-panels">
            {programs.map(function (program) {
              var programParticipants = participants.filter(function (participant) {
                return participant.program_id === program.id;
              });

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

                          return (
                            <JobOfferPanel
                              key={"job_offer" + jobOffer.id}
                              participant={participant}
                              jobOffer={jobOffer}
                              program={program}
                              employer={employers.findById(jobOffer.employer_id)}
                              jobOfferParticipantAgreement={jobOfferParticipantAgreements.findById(jobOffer.job_offer_participant_agreement_id)} />
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
    program: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreement: React.PropTypes.object
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
