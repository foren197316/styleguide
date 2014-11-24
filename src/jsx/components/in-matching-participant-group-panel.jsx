var InMatchingParticipantGroupPanels = React.createClass({
  getInitialState: function () {
    return {
      groups: null,
      enrollments: null
    };
  },

  componentDidMount: function() {
    var enrollments = this.props.enrollments;

    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data.in_matching_participant_groups,
          enrollments: enrollments
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId,
          participantGroupPanelType = this.participantGroupPanelType,
          enrollments = this.state.enrollments,
          groupPanels = this.state.groups.map(function (group) {
            var program = group.program,
                enrollment = enrollments.filter(function (enrollment) {
                  return enrollment.program_id === program.id
                })[0];

            return (
              <InMatchingParticipantGroupPanel key={group.id} data={group} employerId={employerId} enrollment={enrollment} />
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
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString(dateFormat);
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
            expires_on: this.props.onReviewExpiresOn
          }
        };

    $.ajax({
      url: "/on_review_participant_groups.json",
      type: "POST",
      data: data,
      success: function(data) {
        React.unmountComponentAtNode(node);
        $(node).remove();
      },
      error: function(data) {
        window.location = window.location;
      }
    });
  },

  render: function() {
    var actionRow,
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant',
        participantNodes = this.props.data.participants.map(function (participant) {
          return (
            <ParticipantGroupParticipant key={participant.id} data={participant} />
          )
        });

    if (this.state.puttingOnReview) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
            <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
          </div>
        </div>
        <div className="col-xs-12 text-right">
          <hr />
          <p className="panel-text">You will have until <strong>{this.props.onReviewExpiresOn}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{this.props.onReviewExpiresOn}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      </div>
    } else if (this.props.enrollment.on_review_count < this.props.enrollment.on_review_maximum) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <button className="btn btn-success pull-right" onClick={this.handlePutOnReview}>Put on Review</button>
        </div>
      </div>
    } else {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9 text-right">
          <span className="label label-warning">On Review limit reached</span>
        </div>
      </div>
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {participantNodes}
        </div>
        <div className="panel-footer clearfix">
          {actionRow}
        </div>
      </div>
    )
  }
});
