var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {};
  },

  setParticipantNames: function (participants) {
    var offeredParticipantGroupsWithNames = this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
      var participantGroup = this.state.participantGroups.findById(offeredParticipantGroup.participant_group_id);
      var offeredParticipants = participants.findById(participantGroup.participant_ids);
      offeredParticipantGroup.participant_names = offeredParticipants.mapAttribute("name").join(",");

      return offeredParticipantGroup;
    }.bind(this));

    this.setState({
      offeredParticipantGroups: offeredParticipantGroupsWithNames
    });

    return participants;
  },

  setInitialData: function () {
    this.setProps({
      offeredParticipantGroups: this.state.offeredParticipantGroups
    });
  },

  componentDidMount: function() {
    var offeredParticipantGroupsPromise =
      this.loadResource("offeredParticipantGroups")();

    var employersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("employer_id"))
      .then(this.loadResource("employers"));

    var participantsPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"))
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"))
      .then(this.setParticipantNames);

    var draftJobOffersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("draft_job_offer_ids"))
      .then(this.loadResource("draftJobOffers"));

    var jobOffersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_ids"))
      .then(this.loadResource("jobOffers"));

    var jobOffersParticipantAgreementPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_participant_agreement_ids"))
      .then(this.loadResource("jobOfferParticipantAgreements"));

    this.loadAll([
      employersPromise,
      participantsPromise,
      draftJobOffersPromise,
      jobOffersPromise,
      jobOffersParticipantAgreementPromise,
      this.loadResource("programs")()
    ]).done(this.setInitialData);
  },

  renderLoaded: function () {
    var jobOffersLink = this.linkState("jobOffers");
    var offeredParticipantGroupsLink = this.linkState("offeredParticipantGroups");

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="offered_names" searchOn="participant_names" options={this.props.offeredParticipantGroups} dataLink={offeredParticipantGroupsLink} />
        </div>
        <div className="col-md-9">
          <div id="participant-group-panels">
            {this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
              var draftJobOffers = this.state.draftJobOffers.findById(offeredParticipantGroup.draft_job_offer_ids);
              var employer = this.state.employers.findById(offeredParticipantGroup.employer_id);
              var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements.findById(offeredParticipantGroup.job_offer_participant_agreement_ids);
              var jobOffers = this.state.jobOffers.findById(offeredParticipantGroup.job_offer_ids);
              var participantGroup = this.state.participantGroups.findById(offeredParticipantGroup.participant_group_id);
              var participants = this.state.participants.findById(participantGroup.participant_ids);
              var program = this.state.programs.findById(participants[0].program_id);

              return <OfferedParticipantGroupPanel
                      draftJobOffers={draftJobOffers}
                      employer={employer}
                      jobOfferParticipantAgreements={jobOfferParticipantAgreements}
                      jobOffers={jobOffers}
                      jobOffersLink={jobOffersLink}
                      key={"offered_participant_group_"+offeredParticipantGroup.id}
                      offeredParticipantGroup={offeredParticipantGroup}
                      participantGroup={participantGroup}
                      participants={participants}
                      program={program} />
            }.bind(this))}
          </div>
        </div>
      </div>
    )
  },

  render: function() {
    return this.waitForLoadAll(this.renderLoaded);
  }
});
