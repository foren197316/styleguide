var InMatchingParticipantGroupPanels = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {};
  },

  componentDidMount: function() {
    var participantsPromise =
      this.loadResource("inMatchingParticipantGroups")()
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"))
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"));

    this.loadAll([
      this.loadResource("employer")(),
      participantsPromise,
      this.loadResource("enrollments")(),
      this.loadResource("programs")()
    ]).done();
  },

  renderLoaded: function () {
    var employerState = this.linkState('employer'),
        programsState = this.linkState('programs'),
        enrollmentsLink = this.linkState('enrollments'),
        participantsState = this.linkState('participants'),
        participantGroupsState = this.linkState('participantGroups'),
        groupPanels = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
          var participantGroup = participantGroupsState.value.findById(inMatchingParticipantGroup.participant_group_id),
              participants = participantsState.value.findById(participantGroup.participant_ids),
              program = programsState.value.findById(participants[0].program_id),
              enrollment = enrollmentsLink.value.findById(program.id, "program_id"),
              regions = participants.map(function (participant) {
                return participant.region_ids;
              }).flatten();

          if (enrollment !== null && enrollment.searchable && regions.indexOf(employerState.value.region_id) >= 0) {
            return <InMatchingParticipantGroupPanel
                    employer={employerState.value}
                    enrollment={enrollment}
                    enrollments={enrollmentsLink.value}
                    enrollmentsLink={enrollmentsLink}
                    inMatchingParticipantGroup={inMatchingParticipantGroup}
                    key={inMatchingParticipantGroup.id}
                    participantGroup={participantGroup}
                    participants={participants}
                    program={program} />;
          }
        });

    return (
      <div id="participant-group-panels">
        {groupPanels}
      </div>
    )
  },

  render: function() {
    return this.waitForLoadAll(this.renderLoaded);
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
            in_matching_participant_group_id: this.props.inMatchingParticipantGroup.id,
            employer_id: this.props.employer.id,
            expires_on: this.state.onReviewExpiresOn
          }
        };

    $.ajax({
      url: "/on_review_participant_groups.json",
      type: "POST",
      data: data,
      success: function(data) {
        var currentEnrollments = this.props.enrollmentsLink.value.map(function (enrollment, index) {
          if (enrollment.id === this.props.enrollment.id) {
            this.props.enrollment.on_review_count += data.on_review_participant_group.participants.length;
            return this.props.enrollment;
          }

          return enrollment;
        }.bind(this));

        this.props.enrollmentsLink.requestChange(currentEnrollments);

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
        footerName = this.props.participantGroup.name,
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
          <p className="panel-text">You will have until <strong>{this.state.onReviewExpiresOn}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{this.state.onReviewExpiresOn}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
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
