var InMatchingParticipantGroupPanels = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {
      employer: null,
      inMatchingParticipantGroups: null,
      participantGroups: null,
      participants: null,
      enrollments: null,
      programs: null
    };
  },

  componentDidMount: function() {
    this.loadAll([
      this.loadResourceFunc("employer")(),
      this.loadParticipants("inMatchingParticipantGroups"),
      this.loadResourceFunc("enrollments")(),
      this.loadResourceFunc("programs")()
    ]);
  },

  render: function() {
    if (this.state.isLoaded) {
      var employerState = this.linkState('employer'),
          programsState = this.linkState('programs'),
          enrollmentsState = this.linkState('enrollments'),
          participantsState = this.linkState('participants'),
          participantGroupsState = this.linkState('participantGroups'),
          groupPanels = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
            var program = programsState.value.filter(function (program) {
                  return program.id === participantsState.value[0].program_id
                })[0],
                enrollment = enrollmentsState.value.filter(function (enrollment) {
                  return enrollment.program_id === program.id
                })[0];

            if (enrollment === undefined || !enrollment.searchable) return;

            var participantGroup = participantGroupsState.value.filter(function (participantGroup) {
                  return participantGroup.id === inMatchingParticipantGroup.participant_group_id;
                })[0],
                participants = participantsState.value.filter(function (participant) {
                  return participantGroup.participant_ids.indexOf(participant.id) >= 0;
                }),
                regions = participants.map(function (participant) {
                  return participant.region_ids;
                }).flatten();

            if (regions.indexOf(employerState.value.region_id) >= 0) {
              return (
                <InMatchingParticipantGroupPanel key={inMatchingParticipantGroup.id} participants={participants} data={inMatchingParticipantGroup} enrollment={enrollment} program={program} enrollmentsState={enrollmentsState} employerState={employerState} program={program} participantGroup={participantGroup} />
              );
            }
          });

      return (
        <div id="participant-group-panels">
          {groupPanels}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var InMatchingParticipantGroupPanel = React.createClass({
  getInitialState: function() {
    return {
      sending: false,
      puttingOnReview: false,
      onReviewExpiresOn: Date.today().add(3).days().toString(dateFormat)
    };
  },

  canPutOnReview: function () {
    return this.props.enrollment.on_review_count < this.props.enrollment.on_review_maximum
        && this.props.participants.length <= (this.props.enrollment.on_review_maximum - this.props.enrollment.on_review_count);
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            in_matching_participant_group_id: this.props.data.id,
            employer_id: this.props.employerState.value.id,
            expires_on: this.state.onReviewExpiresOn
          }
        };

    $.ajax({
      url: "/on_review_participant_groups.json",
      type: "POST",
      data: data,
      success: function(data) {
        var currentEnrollments = this.props.enrollmentsState.value.map(function (enrollment, index) {
          if (enrollment.id === this.props.enrollment.id) {
            this.props.enrollment.on_review_count += data.on_review_participant_group.participants.length;
            return this.props.enrollment;
          }

          return enrollment;
        }.bind(this));

        this.props.enrollmentsState.requestChange(currentEnrollments);

        React.unmountComponentAtNode(node);
        $(node).remove();
      }.bind(this),
      error: function(data) {
        window.location = window.location;
      }
    });
  },

  render: function() {
    var action,
        legalese,
        footerName = this.props.participantGroup.name + (" - " + this.props.program.name),
        participantPluralized = this.props.participants.length > 1 ? 'participants' : 'participant',
        participantNames = this.props.participants.map(function (participant) {
          return participant.name;
        }).join(",");

    if (this.state.puttingOnReview) {
      action = (
        <div className="btn-group pull-right">
          <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
        </div>
      )
      legalese = (
        <div>
          <p className="panel-text">You will have until <strong>{this.props.onReviewExpiresOn}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{this.props.onReviewExpiresOn}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      )
    } else if (this.canPutOnReview()) {
      action = <button className="btn btn-success pull-right" onClick={this.handlePutOnReview}>Put on Review</button>;
    } else {
      action = <span className="label label-warning">On Review limit reached</span>;
    }

    return (
      <div className="panel panel-default participant-group-panel" data-participant-names={participantNames}>
        <div className="list-group">
          {this.props.participants.map(function (participant) {
            return <ParticipantGroupParticipant key={participant.id} data={participant} />;
          })}
        </div>
        <ParticipantGroupPanelFooter name={footerName}>
          {action}
          {legalese}
        </ParticipantGroupPanelFooter>
      </div>
    )
  }
});
