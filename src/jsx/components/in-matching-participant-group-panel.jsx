var InMatchingParticipantGroupPanels = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      inMatchingParticipantGroups: null,
      participantGroups: null,
      participants: null,
      enrollments: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.urls.inMatchingParticipantGroups, function(data) {
      if (this.isMounted()) {
        this.setState({
          inMatchingParticipantGroups: data.in_matching_participant_groups,
        });
      }
    }.bind(this));

    $.get(this.props.urls.participantGroups, function(data) {
      if (this.isMounted()) {
        this.setState({
          participantGroups: data.participant_groups,
        });
      }
    }.bind(this));

    $.get(this.props.urls.participants, function(data) {
      if (this.isMounted()) {
        this.setState({
          participants: data.participants,
        });
      }
    }.bind(this));

    $.get(this.props.urls.enrollments, function(data) {
      if (this.isMounted()) {
        this.setState({
          enrollments: data.enrollments,
        });
      }
    }.bind(this));
  },

  isLoaded: function() {
    return this.isMounted() &&
           this.state.inMatchingParticipantGroups &&
           this.state.participantGroups &&
           this.state.participants &&
           this.state.enrollments
  },

  render: function() {
    if (this.isLoaded()) {
      var employerId = this.props.employerId,
          enrollmentsState = this.linkState('enrollments'),
          participantsState = this.linkState('participants'),
          groupPanels = this.state.participantGroups.map(function (participantGroup) {
            var program_id = participantGroup.program_id,
                enrollment = enrollmentsState.value.filter(function (enrollment) {
                  return enrollment.program_id === program_id
                })[0],
                participants = participantsState.value.filter(function (participant) {
                  return participantGroup.participant_ids.indexOf(participant.id) >= 0;
                });

            return (
              <InMatchingParticipantGroupPanel key={participantGroup.id} participants={participants} data={participantGroup} employerId={employerId} enrollment={enrollment} enrollmentsState={enrollmentsState} />
            );
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
            employer_id: this.props.employerId,
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
        footerName = this.props.data.name + (this.props.data.program != undefined ? " - " + this.props.data.program.name : ""),
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
