var InMatchingParticipantGroupsIndex = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      genders: [
        { id: "Female", name: "Female" },
        { id: "Male", name: "Male" }
      ],
      ageAtArrival: [
        { id: "21_and_over", name: "21 and Over" },
        { id: "under_21", name: "Under 21" }
      ]
    };
  },

  componentDidMount: function () {
    var participantGroupsPromise =
      this.loadResource("inMatchingParticipantGroups")()
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"));

    var countryPromise =
      participantGroupsPromise
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"))
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
      this.loadResource("enrollments")(),
      this.loadResource("programs")(),
      this.loadResource("positions")()
    ])
    .done(function () {
      this.setProps({
        ageAtArrival: this.state.ageAtArrival,
        countries: this.state.countries,
        enrollments: this.state.enrollments,
        genders: this.state.genders,
        participantGroupNames: this.state.participantGroupNames,
        positions: this.state.positions
      });
    }.bind(this));
  },

  renderLoaded: function () {
    var inMatchingParticipantGroupsLink = this.linkState("inMatchingParticipantGroups"),
        enrollmentsLink = this.linkState("enrollments");

    return (
      <div className="row">
        <div className="col-md-3">
          <CheckBoxFilter title="Positions" options={this.props.positions} dataLink={this.linkState("positions")} />
          <CheckBoxFilter title="Gender" options={this.props.genders} dataLink={this.linkState("genders")} />
          <CheckBoxFilter title="Age at Arrival" options={this.props.ageAtArrival} dataLink={this.linkState("ageAtArrival")} />
          <CheckBoxFilter title="Country" options={this.props.countries} dataLink={this.linkState("countries")} />
          <CheckBoxFilter title="Group Name" options={this.props.participantGroupNames} dataLink={this.linkState("participantGroupNames")} />
        </div>
        <div className="col-md-9">
          {this.state.programs.map(function (program) {
            return (
              <div className="programs" key={"in_matching_participant_group_program_"+program.id}>
                <div className="row">
                  <div className="col-md-12">
                    <h2 className="page-header">{program.name}</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <InMatchingParticipantGroups
                      ageAtArrival={this.state.ageAtArrival}
                      countries={this.state.countries}
                      employer={this.state.employer}
                      enrollments={this.state.enrollments}
                      enrollmentsLink={enrollmentsLink}
                      genders={this.state.genders}
                      inMatchingParticipantGroupsLink={inMatchingParticipantGroupsLink}
                      participantGroupNames={this.state.participantGroupNames}
                      participantGroups={this.state.participantGroups}
                      participants={this.state.participants}
                      positions={this.state.positions}
                      program={program} />
                  </div>
                </div>
              </div>
            )
          }.bind(this))}
        </div>
      </div>
    )
  },

  render: function () {
    return this.waitForLoadAll(this.renderLoaded);
  }
});

var InMatchingParticipantGroups = React.createClass({
  propTypes: {
    inMatchingParticipantGroupsLink: React.PropTypes.object.isRequired
  },

  render: function () {
    var program = this.props.program,
        employer = this.props.employer,
        enrollments = this.props.enrollments,
        enrollmentsLink = this.props.enrollmentsLink,
        enrollment = enrollments.findById(program.id, "program_id"),
        inMatchingParticipantGroupPanels = null;

        if (enrollment !== null && enrollment.searchable) {
          inMatchingParticipantGroupPanels = this.props.inMatchingParticipantGroupsLink.value.map(function (inMatchingParticipantGroup) {
            var participantGroup = this.props.participantGroups.findById(inMatchingParticipantGroup.participant_group_id);

            if (participantGroup === undefined) {
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

                if (! meetsAgeRequirement) {
                  return;
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

    return (
      <div id="participant-group-panels">
        {inMatchingParticipantGroupPanels}
      </div>
    )
  }
});
