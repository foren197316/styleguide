var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [Reflux.ListenerMixin, Reflux.connect(OfferedParticipantGroupStore, "offeredParticipantGroups")],

  getInitialState: function () {
    return { offeredParticipantGroups: null };
  },

  componentDidMount: function() {
    window.RESOURCE_URLS = this.props.urls;
    OfferedParticipantGroupActions.ajaxLoad();
    PositionActions.ajaxLoad();
  },

  render: function () {
    if (this.state.offeredParticipantGroups) {
      return this.renderLoaded();
    } else {
      return <Spinner />
    }
  },

  getOfferedParticipantGroupsCache: function () {
    return OfferedParticipantGroupStore.map(function (offeredParticipantGroup) {
      var draftJobOffers = DraftJobOfferStore.findById(offeredParticipantGroup.draft_job_offer_ids);
      var employer = EmployerStore.findById(offeredParticipantGroup.employer_id);
      var jobOfferParticipantAgreements = JobOfferParticipantAgreementStore.findById(offeredParticipantGroup.job_offer_participant_agreement_ids);
      var jobOffers = JobOfferStore.findById(offeredParticipantGroup.job_offer_ids);
      var participantGroup = ParticipantGroupStore.findById(offeredParticipantGroup.participant_group_id);
      var participants = ParticipantStore.findById(participantGroup.participant_ids);
      var program = ProgramStore.findById(participants[0].program_id);

      if (!program || !employer || (draftJobOffers.length == 0 && jobOffers.length == 0)) {
        return;
      }

      var staff = StaffStore.findById(employer.staff_id);

      if (!staff && !StaffStore.allUnselected) {
        return;
      }

      if (OfferSentStore.data.length === 1) {
        if (
            (OfferSentStore.data[0].id === "Sent" && jobOffers.length === 0)
            || (OfferSentStore.data[0].id === "Unsent" && jobOffers.length > 0)
        ) return;
      }

      if (!this.state.fileMakerReferenceUnselected) {
        participants = participants.filter(function(participant) {
          var jobOffer = jobOffers.findById(participant.id, "participant_id");
          if (!jobOffer) return true;

          var jobOfferFileMakerReference = jobOfferFileMakerReferences.findById(jobOffer.id, "job_offer_id");
          return !jobOfferFileMakerReference;
        });

        if (participants.length === 0) {
          return;
        }
      }

      if (
          ParticipantSignedStore.data.length === 2
          || (ParticipantSignedStore.data.length === 1 && ParticipantSignedStore.data[0].id === "Signed" && jobOfferParticipantAgreements.length === participants.length)
          || (ParticipantSignedStore.data.length === 1 && ParticipantSignedStore.data[0].id === "Unsigned" && jobOfferParticipantAgreements.length < participants.length)
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
    }).notEmpty();
  },

  renderLoaded: function () {
    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="offered_names" searchOn={["participant_names", "participant_emails", "participant_uuids"]} store={OfferedParticipantGroupStore} actions={OfferedParticipantGroupActions} />
          <CheckBoxFilter title="Program" store={ProgramStore} actions={ProgramActions} />
          <CheckBoxFilter title="Participant Agreement" store={ParticipantSignedStore} actions={ParticipantSignedActions} />
          <CheckBoxFilter title="Offer Sent" store={OfferSentStore} actions={OfferSentActions} />
          <CheckBoxFilter title="Coordinator" store={StaffStore} actions={StaffActions} />
          <CheckBoxFilter title="Employer" store={EmployerStore} actions={EmployerActions} />
        </div>
        <div className="col-md-9">
          <div id="participant-group-panels">
            {this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
              return <OfferedParticipantGroupPanel offeredParticipantGroup={offeredParticipantGroup} key={"offered_participant_group_"+offeredParticipantGroup.id} />
            })}
          </div>
        </div>
      </div>
    )
  }
});
