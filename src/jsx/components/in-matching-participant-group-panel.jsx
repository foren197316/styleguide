var InMatchingParticipantGroupPanels = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      groups: null,
      enrollments: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data.in_matching_participant_groups,
        });
      }
    }.bind(this));

    $.get(this.props.enrollmentsSource, function(data) {
      if (this.isMounted()) {
        this.setState({
          enrollments: data.enrollments,
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted() && this.state.groups && this.state.enrollments) {
      var employerId = this.props.employerId,
          participantGroupPanelType = this.participantGroupPanelType,
          enrollments = this.state.enrollments,
          enrollmentsState = this.linkState('enrollments'),
          groupPanels = this.state.groups.map(function (group) {
            var program_id = group.program.id,
                enrollment = enrollments.filter(function (enrollment) {
                  return enrollment.program_id === program_id
                })[0];

            return (
              <InMatchingParticipantGroupPanel key={group.id} data={group} employerId={employerId} enrollment={enrollment} enrollmentsState={enrollmentsState} />
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
        && this.props.data.participants.length <= (this.props.enrollment.on_review_maximum - this.props.enrollment.on_review_count);
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
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant',
        participantNames = this.props.data.participants.map(function (participant) {
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
          {this.props.data.participants.map(function (participant) {
            return <ParticipantGroupParticipant key={participant.id} data={participant} />;
          })}
        </div>
        <ParticipantGroupPanelFooter name={this.props.data.name}>
          {action}
          {legalese}
        </ParticipantGroupPanelFooter>
      </div>
    )
  }
});
