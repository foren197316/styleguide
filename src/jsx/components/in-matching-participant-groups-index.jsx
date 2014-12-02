var InMatchingParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      ageAtArrival: [
        { id: "21_and_over", name: "21 and Over" },
        { id: "under_21", name: "Under 21" }
      ],
      genders: [
        { id: "Female", name: "Female" },
        { id: "Male", name: "Male" }
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

  componentDidMount: function () {
    var participantGroupsPromise =
      this.loadResource("inMatchingParticipantGroups")()
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"));

    var participantsPromise =
      participantGroupsPromise
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"));

    var programsPromise =
      participantsPromise
      .then(this.loadResource("enrollments"))
      .then(function (enrollments) {
        var searchableEnrollments = enrollments.filter(function (enrollment) {
          return enrollment.searchable;
        });

        this.setState({
          enrollments: searchableEnrollments
        });

        return searchableEnrollments;
      }.bind(this))
      .then(this.extractIds("program_id"))
      .then(this.loadResource("programs"))
      .then(function (programs) {
        var programsWithCount = programs.map(function (program) {
          program.participant_count = 0;
          return program;
        });

        var participants = this.state.participants.filter(function (participant) {
          for (var i in programsWithCount) {
            if (programsWithCount[i].id === participant.program_id) {
              programsWithCount[i].participant_count++;
              return true;
            }
          }

          return false;
        });

        this.setState({
          participants: participants,
          programs: programsWithCount
        });

        return participants;
      }.bind(this));

    var participantGroupsWithParticipantNamesPromise =
      participantsPromise
      .then(function (participants) {
        var participantGroupsWithParticipantNames = this.state.participantGroups.map(function (participantGroup) {
          participantGroup.participant_names = participants
            .findById(participantGroup.participant_ids)
            .mapAttribute("name")
            .join(",");

          return participantGroup;
        }).filter(function (participantGroup) {
          return participantGroup.participant_names.trim().length > 0;
        });

        this.setState({
          participantGroups: participantGroupsWithParticipantNames
        });

        return participantGroupsWithParticipantNames;
      }.bind(this));

    var countryPromise =
      participantsPromise
      .then(this.extractIds("country_name"))
      .then(function (data) {
        var countries = data.ids.uniq().sort().map(function (country) {
          return { id: country, name: country };
        });

        this.setState({
          countries: countries
        });

        return true;
      }.bind(this));

    var groupNamePromise =
      participantGroupsPromise
      .then(this.extractIds("name"))
      .then(function (data) {
        var names = data.ids.uniq().sort().map(function (name) {
          return { id: name, name: name };
        });

        this.setState({
          participantGroupNames: names
        });

        return true;
      }.bind(this));

    this.loadAll([
      this.loadResource("employer")(),
      countryPromise,
      groupNamePromise,
      participantGroupsWithParticipantNamesPromise,
      programsPromise,
      this.loadResource("positions")()
    ])
    .done(function () {
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
    }.bind(this));
  },

  renderLoaded: function () {
    var enrollmentsLink = this.linkState("enrollments");

    return (
      <div className="row">
        <div className="col-md-3">
          <SearchFilter title="Search" searchOn="participant_names" options={this.props.participantGroups} dataLink={this.linkState("participantGroups")} />
          <CheckBoxFilter title="Age at Arrival" options={this.props.ageAtArrival} dataLink={this.linkState("ageAtArrival")} />
          <CheckBoxFilter title="Group" options={this.props.participantGroupNames} dataLink={this.linkState("participantGroupNames")} />
          <CheckBoxFilter title="Gender" options={this.props.genders} dataLink={this.linkState("genders")} />
          <CheckBoxFilter title="English Level" options={this.props.englishLevels} dataLink={this.linkState("englishLevels")} />
          <CheckBoxFilter title="Positions" options={this.props.positions} dataLink={this.linkState("positions")} />
          <CheckBoxFilter title="Country" options={this.props.countries} dataLink={this.linkState("countries")} />
        </div>
        <div className="col-md-9">
          {this.state.programs.map(function (program) {
            return (
              <InMatchingParticipantGroups
                ageAtArrival={this.state.ageAtArrival}
                countries={this.state.countries}
                employer={this.state.employer}
                enrollments={this.state.enrollments}
                enrollmentsLink={enrollmentsLink}
                genders={this.state.genders}
                inMatchingParticipantGroups={this.state.inMatchingParticipantGroups}
                participantGroupNames={this.state.participantGroupNames}
                participantGroups={this.state.participantGroups}
                participants={this.state.participants}
                positions={this.state.positions}
                program={program} />
            )
          }.bind(this))}
        </div>
      </div>
    )
  },

  render: function () {
    return this.waitForLoadAll(function() {
      return this.renderLoaded();
    }.bind(this));
  }
});

var InMatchingParticipantGroups = React.createClass({
  propTypes: {
    inMatchingParticipantGroups: React.PropTypes.array.isRequired
  },

  render: function () {
    var program = this.props.program,
        employer = this.props.employer,
        enrollments = this.props.enrollments,
        enrollmentsLink = this.props.enrollmentsLink,
        enrollment = enrollments.findById(program.id, "program_id"),
        inMatchingParticipantGroupPanels = null;

    if (enrollment !== null && enrollment.searchable) {
      inMatchingParticipantGroupPanels = this.props.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
        var participantGroup = this.props.participantGroups.findById(inMatchingParticipantGroup.participant_group_id);

        if (participantGroup === undefined || participantGroup === null) {
          return;
        }

        if (this.props.participantGroupNames.mapAttribute("name").indexOf(participantGroup.name) < 0) {
          return;
        }

        var participants = this.props.participants.filter(function (participant) {
              return participant.program_id === program.id;
            }).findById(participantGroup.participant_ids),
            regions = participants.map(function (participant) {
              return participant.region_ids;
            }).flatten();

        if (regions.indexOf(employer.region_id) >= 0) {
          var participantGroupParticipants = participants.findById(participantGroup.participant_ids),
              participantGroupParticipantPositionIds = participantGroupParticipants.mapAttribute("position_ids").flatten();

          if (!participantGroupParticipantPositionIds.intersects(this.props.positions.mapAttribute("id"))) {
            return;
          }

          var participantGenders = participantGroupParticipants.mapAttribute("gender");

          if (!this.props.genders.mapAttribute("id").intersects(participantGenders)) {
            return;
          }

          if (this.props.ageAtArrival.length === 1) {
            var meetsAgeRequirement;

            if (this.props.ageAtArrival[0].id === "21_and_over") {
              meetsAgeRequirement = participantGroupParticipants.reduce(function (prev, curr) {
                return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) >= 21;
              }, false);
            } else {
              meetsAgeRequirement = participantGroupParticipants.reduce(function (prev, curr) {
                return prev || calculateAgeAtArrival(curr.arrival_date, curr.date_of_birth) < 21;
              }, false);
            }

<<<<<<< HEAD
            if (! meetsAgeRequirement) {
              return;
=======
            var participants = this.props.participants.filter(function (participant) {
                  return participant.program_id === program.id;
                }).findById(participantGroup.participant_ids),
                regions = participants.map(function (participant) {
                  return participant.region_ids;
                }).flatten();

            if (regions.indexOf(employer.region_id) >= 0) {
              var participantGroupParticipants = participants.findById(participantGroup.participant_ids),
                  participantGroupParticipantPositionIds = participantGroupParticipants.mapAttribute("position_ids").flatten();

              if (this.props.ageAtArrival.length === 1) {
                var meetsAgeRequirement;

                if (this.props.ageAtArrival[0].id === "21_and_over") {
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

              if (!participantGroupParticipantPositionIds.intersects(this.props.positions.mapAttribute("id"))) {
                return;
              }

              var participantGenders = participantGroupParticipants.mapAttribute("gender");

              if (!this.props.genders.mapAttribute("id").intersects(participantGenders)) {
                return;
              }

              var participantCountries = participantGroupParticipants.mapAttribute("country_name");

              if (!this.props.countries.mapAttribute("name").intersects(participantCountries)) {
                return;
              }

              var participantEnglishLevels = participantGroupParticipants.mapAttribute("english_level");

              if (!this.props.englishLevels.mapAttribute("id").intersects(participantEnglishLevels)) {
                return;
              }

              return <InMatchingParticipantGroupPanel
                      employer={employer}
                      enrollment={enrollment}
                      enrollments={enrollments}
                      enrollmentsLink={enrollmentsLink}
                      inMatchingParticipantGroup={inMatchingParticipantGroup}
                      key={inMatchingParticipantGroup.id}
                      participantGroup={participantGroup}
                      participants={participants}
                      program={program} />;
>>>>>>> english level filtering
            }
          }

          var participantCountries = participantGroupParticipants.mapAttribute("country_name");

          if (!this.props.countries.mapAttribute("name").intersects(participantCountries)) {
            return;
          }

          return <InMatchingParticipantGroupPanel
                  employer={employer}
                  enrollment={enrollment}
                  enrollments={enrollments}
                  enrollmentsLink={enrollmentsLink}
                  inMatchingParticipantGroup={inMatchingParticipantGroup}
                  key={inMatchingParticipantGroup.id}
                  participantGroup={participantGroup}
                  participants={participants}
                  program={program} />;
        }
      }.bind(this));
    }

    if (inMatchingParticipantGroupPanels != undefined) {
      inMatchingParticipantGroupPanels = inMatchingParticipantGroupPanels.filter(function (panel) {
        return panel != undefined;
      });
    } else {
      inMatchingParticipantGroupPanels = [];
    }

    if (inMatchingParticipantGroupPanels.length > 0) {
      return (
        <div className="programs" key={"in_matching_participant_group_program_"+this.props.program.id}>
          <div className="row">
            <div className="col-md-12">
              <h2 className="page-header">
                {this.props.program.name}
                <small className="pull-right">{this.props.program.participant_count} Participants</small>
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div id="participant-group-panels">
                {inMatchingParticipantGroupPanels}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
});
