var InMatchingParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  statics: {
    noResultsMessage: "There are currently no participants available who match your criteria. Check back soon!"
  },

  getInitialState: function () {
    return {
      genders: [
        { id: "Female", name: "Female" },
        { id: "Male", name: "Male" }
      ],
      ageAtArrival: [
        { id: "21_and_over", name: "21 and Over" },
        { id: "under_21", name: "Under 21" }
      ],
      englishLevels: [
        { id: 10, name: "10" },
        { id: 9, name: "9" },
        { id: 8, name: "8" },
        { id: 7, name: "7" },
        { id: 6, name: "6" },
        { id: 5, name: "5" }
      ]
    };
  },

  filterParticipants: function (programs) {
    var filteredParticipants = [];

    var participantGroupsWithParticipantNames = this.state.participantGroups.map(function (participantGroup) {
      var participantGroupParticipants = this.state.participants.findById(participantGroup.participant_ids),
          regionIds = participantGroupParticipants.mapAttribute("region_ids").flatten();

      if (regionIds.indexOf(this.state.employer.region_id) >= 0) {
        participantGroup.participant_names = participantGroupParticipants.mapAttribute("name").join(",");
        participantGroup.start_dates = participantGroupParticipants.map(function (participant) {
          return Date.parse(participant.arrival_date).add(2).days();
        }).flatten();
        participantGroup.finish_dates = participantGroupParticipants.map(function (participant) {
          return Date.parse(participant.departure_date);
        }).flatten();
      } else {
        participantGroup.participant_names = "";
        participantGroup.start_dates = [];
        participantGroup.finish_dates = [];
      }

      if (participantGroup.participant_names.trim().length > 0) {
        filteredParticipants = filteredParticipants.concat(participantGroupParticipants);
      }

      return participantGroup;
    }.bind(this)).filter(function (participantGroup) {
      return participantGroup.participant_names.trim().length > 0;
    });

    filteredParticipants = filteredParticipants.filter(function (participant) {
      if (programs.findById(participant.program_id)) {
        return true;
      }

      return false;
    });

    this.setState({
      participantGroups: participantGroupsWithParticipantNames,
      participants: filteredParticipants
    });

    return filteredParticipants;
  },

  filterEnrollments: function (enrollments) {
    var searchableEnrollments = enrollments.filter(function (enrollment) {
      return enrollment.searchable;
    });

    this.setState({
      enrollments: searchableEnrollments
    });

    return searchableEnrollments;
  },

  setCountries: function (data) {
    var countries = data.ids.uniq().sort().map(function (country) {
      return { id: country, name: country };
    });

    this.setState({
      countries: countries
    });

    return true;
  },

  setParticipantGroupNames: function (data) {
    var names = data.ids.uniq().sort().map(function (name) {
      return { id: name, name: name };
    });

    this.setState({
      participantGroupNames: names
    });

    return true;
  },

  afterLoad: function () {
    this.setProps({
      participantGroups: this.state.participantGroups,
      ageAtArrival: this.state.ageAtArrival,
      countries: this.state.countries,
      enrollments: this.state.enrollments,
      genders: this.state.genders,
      englishLevels: this.state.englishLevels,
      participantGroupNames: this.state.participantGroupNames,
      positions: this.state.positions
    });

    Intercom('trackEvent', 'visited-employer-participants-search', {
      employer_id: this.state.employer.id,
      employer_name: this.state.employer.name
    });
  },

  componentDidMount: function () {
    var participantGroupsPromise =
      this.loadResource("employer")()
      .then(this.loadResource("inMatchingParticipantGroups"))
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"));

    var participantsPromise =
      participantGroupsPromise
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"))
      .then(this.loadResource("enrollments", true))
      .then(this.filterEnrollments)
      .then(this.extractIds("program_id"))
      .then(this.loadResource("programs"))
      .then(this.filterParticipants)
      .then(this.extractIds("country_name"))
      .then(this.setCountries);

    var groupNamePromise =
      participantGroupsPromise
      .then(this.extractIds("name"))
      .then(this.setParticipantGroupNames);

    this.loadAll([
      participantsPromise,
      groupNamePromise,
      this.loadResource("positions")()
    ])
    .done(this.afterLoad);
  },

  getProgramCache: function (program) {
    var employer = this.state.employer,
        enrollments = this.state.enrollments,
        enrollmentsLink = this.linkState("enrollments"),
        enrollment = enrollments.findById(program.id, "program_id"),
        inMatchingParticipantGroupPanels = null,
        participantCount = 0,
        programParticipants = this.state.participants.filter(function (participant) {
                                return participant.program_id === program.id;
                              });

    inMatchingParticipantGroupPanels = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
      var participantGroup = this.state.participantGroups.findById(inMatchingParticipantGroup.participant_group_id);

      if (participantGroup === undefined || participantGroup === null) {
        return;
      }

      if (this.state.participantGroupNames.mapAttribute("name").indexOf(participantGroup.name) < 0) {
        return;
      }

      var participantGroupParticipants = programParticipants.findById(participantGroup.participant_ids),
          participantGroupParticipantPositionIds = participantGroupParticipants.mapAttribute("position_ids").flatten();

      if (!participantGroupParticipantPositionIds.intersects(this.state.positions.mapAttribute("id"))) {
        return;
      }

      var participantGenders = participantGroupParticipants.mapAttribute("gender");

      if (!this.state.genders.mapAttribute("id").intersects(participantGenders)) {
        return;
      }

      if (this.state.ageAtArrival.length === 1) {
        var meetsAgeRequirement;

        if (this.state.ageAtArrival[0].id === "21_and_over") {
          meetsAgeRequirement = participantGroupParticipants.reduce(function (prev, curr) {
            return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) >= 21;
          }, false);
        } else {
          meetsAgeRequirement = participantGroupParticipants.reduce(function (prev, curr) {
            return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) < 21;
          }, false);
        }

        if (! meetsAgeRequirement) {
          return;
        }
      }

      var participantCountries = participantGroupParticipants.mapAttribute("country_name");

      if (!this.state.countries.mapAttribute("name").intersects(participantCountries)) {
        return;
      }

      var participantEnglishLevels = participantGroupParticipants.mapAttribute("english_level");

      if (!this.state.englishLevels.mapAttribute("id").intersects(participantEnglishLevels)) {
        return;
      }

      participantCount += participantGroupParticipants.length;

      return <InMatchingParticipantGroupPanel
                employer={employer}
                enrollment={enrollment}
                enrollments={enrollments}
                enrollmentsLink={enrollmentsLink}
                inMatchingParticipantGroup={inMatchingParticipantGroup}
                key={inMatchingParticipantGroup.id}
                participantGroup={participantGroup}
                participants={participantGroupParticipants}
                program={program} />;
    }.bind(this)).notEmpty();

    if (inMatchingParticipantGroupPanels.length > 0) {
      return {
        program: program,
        inMatchingParticipantGroupPanels: inMatchingParticipantGroupPanels,
        participantCount: participantCount
      }
    }
  },

  renderLoaded: function () {
    var enrollmentsLink       = this.linkState("enrollments"),
        participantGroupsLink = this.linkState("participantGroups"),
        allPrograms           = this.state.programs.map(this.getProgramCache).notEmpty();

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn="participant_names" options={this.props.participantGroups} dataLink={participantGroupsLink} />
          <CheckBoxFilter title="Age at Arrival" options={this.props.ageAtArrival} dataLink={this.linkState("ageAtArrival")} />
          <CheckBoxFilter title="Group" options={this.props.participantGroupNames} dataLink={this.linkState("participantGroupNames")} />
          <CheckBoxFilter title="Gender" options={this.props.genders} dataLink={this.linkState("genders")} />
          <CheckBoxFilter title="English Level" options={this.props.englishLevels} dataLink={this.linkState("englishLevels")} />
          <DateRangeFilter searchFrom="start_dates" searchTo="finish_dates" options={this.props.participantGroups} dataLink={participantGroupsLink} />
          <CheckBoxFilter title="Positions" options={this.props.positions} dataLink={this.linkState("positions")} />
          <CheckBoxFilter title="Country" options={this.props.countries} dataLink={this.linkState("countries")} />
        </div>
        <div className="col-md-9">
          {function () {
            if (allPrograms.length > 0) {
              return allPrograms.map(function (data) {
                return (
                  <div className="programs" key={"in_matching_participant_group_program_"+data.program.id}>
                    <div className="row">
                      <div className="col-md-12">
                        <h2 className="page-header">
                          {data.program.name}
                          <small className="pull-right">{data.participantCount} Participants</small>
                        </h2>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div id="participant-group-panels">
                          {data.inMatchingParticipantGroupPanels}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }.bind(this))
            } else {
              return <Alert type="warning" message={InMatchingParticipantGroupsIndex.noResultsMessage} closeable={false} />
            }
          }.bind(this)()}
        </div>
      </div>
    )
  },

  render: function () {
    return this.waitForLoadAll(this.renderLoaded);
  }
});
