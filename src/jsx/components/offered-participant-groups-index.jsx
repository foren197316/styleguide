var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      participantSigned: [
        { id: "Signed", name: "All Signed" },
        { id: "Unsigned", name: "Any Unsigned" }
      ],
      offerSent: [
        { id: "Sent", name: "Sent" },
        { id: "Unsent", name: "Unsent" }
      ],
      fileMakerReference: [
        { id: "false", name: "Not in FileMaker" }
      ],
      allStaffsUnselected: true,
      fileMakerReferenceUnselected: true
    };
  },

  setParticipantNames: function (participants) {
    var offeredParticipantGroupsWithNames = this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
      var participantGroup = this.state.participantGroups.findById(offeredParticipantGroup.participant_group_id);
      var offeredParticipants = participants.findById(participantGroup.participant_ids);
      offeredParticipantGroup.participant_names = offeredParticipants.mapAttribute("name").join(",");
      offeredParticipantGroup.participant_uuids = offeredParticipants.mapAttribute("uuid").join(",");
      offeredParticipantGroup.participant_emails = offeredParticipants.mapAttribute("email").join(",");

      return offeredParticipantGroup;
    }.bind(this));

    this.setState({
      offeredParticipantGroups: offeredParticipantGroupsWithNames
    });

    return participants;
  },

  setInitialData: function () {
    this.setProps({
      employers: this.state.employers,
      offeredParticipantGroups: this.state.offeredParticipantGroups,
      jobOffers: this.state.jobOffers,
      jobOfferParticipantAgreements: this.state.jobOfferParticipantAgreements,
      jobOfferFileMakerReferences: this.state.jobOfferFileMakerReferences,
      offerSent: this.state.draftJobOffers.length > 0 ? this.state.offerSent : [],
      fileMakerReference: this.state.fileMakerReference,
      participantSigned: this.state.participantSigned,
      programs: this.state.programs,
      staffs: this.state.staffs
    });
  },

  componentDidMount: function() {
    var offeredParticipantGroupsPromise = this.loadResource("offeredParticipantGroups")();

    var staffsPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("employer_id"))
      .then(this.loadResource("employers"))
      .then(this.extractIds("staff_id"))
      .then(this.loadResource("staffs"));

    var participantsPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"))
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"))
      .then(this.setParticipantNames)
      .then(this.extractIds("program_id"))
      .then(this.loadResource("programs"));

    var draftJobOffersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("draft_job_offer_ids"))
      .then(this.loadResource("draftJobOffers"));

    var jobOffersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_ids"))
      .then(this.loadResource("jobOffers"));

    var jobOfferParticipantAgreementsPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_participant_agreement_ids"))
      .then(this.loadResource("jobOfferParticipantAgreements"));

    var jobOfferFileMakerReferencesPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_file_maker_reference_ids"))
      .then(this.loadResource("jobOfferFileMakerReferences"));

    var positionsPromise =
      this.loadResource("positions")();

    this.loadAll([
      staffsPromise,
      participantsPromise,
      draftJobOffersPromise,
      jobOffersPromise,
      jobOfferParticipantAgreementsPromise,
      jobOfferFileMakerReferencesPromise,
      positionsPromise
    ]).done(this.setInitialData);
  },

  getOfferedParticipantGroupsCache: function () {
    return this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
      var draftJobOffers = this.state.draftJobOffers.findById(offeredParticipantGroup.draft_job_offer_ids);
      var employer = this.state.employers.findById(offeredParticipantGroup.employer_id);
      var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements.findById(offeredParticipantGroup.job_offer_participant_agreement_ids);
      var jobOfferFileMakerReferences = this.state.jobOfferFileMakerReferences.findById(offeredParticipantGroup.job_offer_file_maker_reference_ids);
      var jobOffers = this.state.jobOffers.findById(offeredParticipantGroup.job_offer_ids);
      var participantGroup = this.state.participantGroups.findById(offeredParticipantGroup.participant_group_id);
      var participants = this.state.participants.findById(participantGroup.participant_ids);
      var program = this.state.programs.findById(participants[0].program_id);

      if (!program || !employer || (draftJobOffers.length == 0 && jobOffers.length == 0)) {
        return null;
      }

      var staff = this.state.staffs.findById(employer.staff_id);

      if (!staff && !this.state.allStaffsUnselected) {
        return null;
      }

      if (this.state.offerSent.length === 1) {
        if (
            (this.state.offerSent[0].id === "Sent" && jobOffers.length === 0)
            || (this.state.offerSent[0].id === "Unsent" && jobOffers.length > 0)
        ) return;
      }

      if (!this.state.fileMakerReferenceUnselected) {
        participants = participants.filter(function(participant) {
          var jobOffer = jobOffers.filter(function(jobOffer) { return jobOffer.participant_id === participant.id; })[0];
          var jobOfferFileMakerReference = jobOfferFileMakerReferences.filter(function(jobOfferFileMakerReference) {
            return jobOfferFileMakerReference.job_offer_id === jobOffer.id;
          })[0];

          return !jobOffer || !jobOfferFileMakerReference;
        });

        if (participants.length === 0) {
          return;
        }
      }

      if (
          this.state.participantSigned.length === 2
          || (this.state.participantSigned.length === 1 && this.state.participantSigned[0].id === "Signed" && jobOfferParticipantAgreements.length === participants.length)
          || (this.state.participantSigned.length === 1 && this.state.participantSigned[0].id === "Unsigned" && jobOfferParticipantAgreements.length < participants.length)
         )
      {
        return {
          id: offeredParticipantGroup.id,
          draftJobOffers: draftJobOffers,
          employer: employer,
          jobOffers: jobOffers,
          jobOfferParticipantAgreements: jobOfferParticipantAgreements,
          jobOfferFileMakerReferences: jobOfferFileMakerReferences,
          offeredParticipantGroup: offeredParticipantGroup,
          participantGroup: participantGroup,
          participants: participants,
          program: program,
          staff: staff
        };
      }

      return null;
    }.bind(this)).notEmpty();
  },

  renderLoaded: function () {
    var jobOffersLink = this.linkState("jobOffers");
    var offeredParticipantGroupsLink = this.linkState("offeredParticipantGroups");
    var participantSignedLink = this.linkState("participantSigned");
    var offerSentLink = this.linkState("offerSent");
    var fileMakerReferenceLink = this.linkState("fileMakerReference");
    var programsLink = this.linkState("programs");
    var employersLink = this.linkState("employers");
    var staffsLink = this.linkState("staffs");
    var allStaffsUnselectedLink = this.linkState("allStaffsUnselected");
    var fileMakerReferenceUnselectedLink = this.linkState("fileMakerReferenceUnselected");

    var offeredParticipantGroupsCache = this.getOfferedParticipantGroupsCache();

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="offered_names" searchOn={["participant_names", "participant_uuids", "participant_emails"]} options={this.props.offeredParticipantGroups} dataLink={offeredParticipantGroupsLink} />
          <CheckBoxFilter title="Program" options={this.props.programs} dataLink={programsLink} />
          <CheckBoxFilter title="Participant Agreement" options={this.props.participantSigned} dataLink={participantSignedLink} />
          <CheckBoxFilter title="Offer Sent" options={this.props.offerSent} dataLink={offerSentLink} />
          <CheckBoxFilter title="Coordinator" options={this.props.staffs} dataLink={staffsLink} allUnselectedLink={allStaffsUnselectedLink} />
          <CheckBoxFilter title="Employer" options={this.props.employers} dataLink={employersLink} />
        </div>
        <div className="col-md-9">
          <div id="participant-group-panels">
            {offeredParticipantGroupsCache.map(function (cache) {
              return <OfferedParticipantGroupPanel
                      draftJobOffers={cache.draftJobOffers}
                      employer={cache.employer}
                      jobOffers={cache.jobOffers}
                      jobOfferParticipantAgreements={cache.jobOfferParticipantAgreements}
                      jobOfferFileMakerReferences={cache.jobOfferFileMakerReferences}
                      jobOffersLink={jobOffersLink}
                      key={"offered_participant_group_"+cache.id}
                      offeredParticipantGroup={cache.offeredParticipantGroup}
                      participantGroup={cache.participantGroup}
                      participants={cache.participants}
                      positions={this.state.positions}
                      program={cache.program}
                      staff={cache.staff} />
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
