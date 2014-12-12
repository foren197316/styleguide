var OfferedParticipantGroupsIndex = React.createClass({
  mixins: [Reflux.ListenerMixin],

  getInitialState: function () {
    return {
      allStaffsUnselected: true
    };
  },

  initOfferSentStore: function () {
    window.OfferSentActions = Reflux.createActions(genericStoreActions);

    window.OfferSentStore = Reflux.createStore({
      listenables: OfferSentActions,

      permission: false,

      init: function () {
        this.draftJobOfferListener = this.listenTo(DraftJobOfferStore, this.handlePermissions);
      },

      handlePermissions: function () {
        this.draftJobOfferListener.stop();

        if (DraftJobOfferStore.permission) {
          this.permission = true;
          this.staticData = this.data = [
            { id: "Sent", name: "Sent" },
            { id: "Unsent", name: "Unsent" }
          ]
        }
      }
    });
  },

  initParticipantSignedStore: function () {
    window.ParticipantSignedActions = Reflux.createActions(genericStoreActions);

    window.ParticipantSignedStore = Reflux.createStore({
      listenables: ParticipantSignedActions,

      permission: true,

      init: function () {
        this.staticData = this.data = [
          { id: "Signed", name: "All Signed" },
          { id: "Unsigned", name: "Any Unsigned" }
        ]
      }
    });
  },

  componentDidMount: function() {
    initStores(this.props.urls);
    this.initOfferSentStore();
    this.initParticipantSignedStore();

    this.renderListener = this.joinTrailing(
      OfferedParticipantGroupStore,
      ParticipantGroupStore,
      ParticipantStore,
      ProgramStore,
      EmployerStore,
      StaffStore,
      DraftJobOfferStore,
      JobOfferStore,
      JobOfferParticipantAgreementStore,
      PositionStore,
      this.setLoadedState
    );
  },

  setLoadedState: function () {
    this.renderListener.stop();
    this.setState({ isLoaded: true });

    var forceUpdate = function () { this.forceUpdate(); }.bind(this);

    this.listenTo(OfferedParticipantGroupStore, forceUpdate);
    // this.listenTo(ParticipantGroupStore, forceUpdate);
    // this.listenTo(ParticipantStore, forceUpdate);
    // this.listenTo(ProgramStore, forceUpdate);
    // this.listenTo(EmployerStore, forceUpdate);
    // this.listenTo(StaffStore, forceUpdate);
    // this.listenTo(DraftJobOfferStore, forceUpdate);
    // this.listenTo(JobOfferStore, forceUpdate);
    // this.listenTo(JobOfferParticipantAgreementStore, forceUpdate);
    // this.listenTo(PositionStore, forceUpdate);
    // this.listenTo(OfferSentStore, forceUpdate);
    // this.listenTo(ParticipantSignedStore, forceUpdate);
  },

  render: function () {
    if (this.state.isLoaded) {
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
    // var offeredParticipantGroupsCache = this.getOfferedParticipantGroupsCache();

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="offered_names" searchOn={["participant_names", "participant_emails", "participant_uuids"]} store={OfferedParticipantGroupStore} actions={OfferedParticipantGroupActions} />
          <CheckBoxFilter title="Program" store={ProgramStore} actions={ProgramActions} />
          <CheckBoxFilter title="Participant Agreement" store={ParticipantSignedStore} actions={ParticipantSignedActions} />
          <CheckBoxFilter title="Offer Sent" store={OfferSentStore} actions={OfferSentActions} />
          <CheckBoxFilter title="Coordinator" store={StaffStore} actions={StaffActions} />
          <CheckBoxFilter title="Employer" store={EmployerStore} actions={EmployerActions} />
          <ExportButton url={this.props.urls.export} ids={OfferedParticipantGroupStore.mapAttribute("id")} />
        </div>
        <div className="col-md-9">
          <div id="participant-group-panels">
            {OfferedParticipantGroupStore.map(function (offeredParticipantGroup) {
              var draftJobOffers = DraftJobOfferStore.findById(offeredParticipantGroup.draft_job_offer_ids);
              var employer = EmployerStore.findById(offeredParticipantGroup.employer_id);
              var jobOfferParticipantAgreements = JobOfferParticipantAgreementStore.findById(offeredParticipantGroup.job_offer_participant_agreement_ids);
              var jobOffers = JobOfferStore.findById(offeredParticipantGroup.job_offer_ids);
              var participantGroup = ParticipantGroupStore.findById(offeredParticipantGroup.participant_group_id);
              var participants = ParticipantStore.findById(participantGroup.participant_ids);
              var program = ProgramStore.findById(participants[0].program_id);
              var staff = StaffStore.findById(employer.staff_id);

              return <OfferedParticipantGroupPanel
                      draftJobOffers={draftJobOffers}
                      employer={employer}
                      jobOffers={jobOffers}
                      jobOfferParticipantAgreements={jobOfferParticipantAgreements}
                      key={"offered_participant_group_"+offeredParticipantGroup.id}
                      offeredParticipantGroup={offeredParticipantGroup}
                      participantGroup={participantGroup}
                      participants={participants}
                      program={program}
                      staff={staff} />
            })}
          </div>
        </div>
      </div>
    )
  }
});
