var InMatchingParticipantGroupPanel = React.createClass({
  propTypes: {
    employer: React.PropTypes.object.isRequired,
    enrollment: React.PropTypes.object.isRequired,
    inMatchingParticipantGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      sending: false,
      puttingOnReview: false,
      onReviewExpiresOn: Date.today().add(3).days().toString(dateFormat)
    };
  },

  canPutOnReview: function () {
    return this.props.enrollment.on_review_count < this.props.enrollment.on_review_maximum
        && this.props.inMatchingParticipantGroup.participants.length <= (this.props.enrollment.on_review_maximum - this.props.enrollment.on_review_count);
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });

    Intercom('trackEvent', 'clicked-employer-participants-review', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.participantNames()
    });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });

    Intercom('trackEvent', 'canceled-employer-participants-review', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.participantNames()
    });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    InMatchingParticipantGroupActions.offer(
      this.props.inMatchingParticipantGroup,
      this.props.employer,
      this.props.enrollment,
      this.state.onReviewExpiresOn,
      function (data) {
        this.setState({status: data.responseJSON.status});

        Intercom('trackEvent', 'confirmed-employer-participants-review', {
          employer_id: this.props.employer.id,
          employer_name: this.props.employer.name,
          participant_names: this.participantNames()
        });
      }.bind(this)
    );
  },

  participantNames: function () {
    return this.props.inMatchingParticipantGroup.participants.mapAttribute("name").join(", ");
  },

  render: function() {
    var action,
        legalese,
        footerName = this.props.inMatchingParticipantGroup.name,
        participantPluralized = this.props.inMatchingParticipantGroup.participants.length > 1 ? 'participants' : 'participant';

    if (this.state.status) {
      var status = this.state.status;
      return <Alert type={status.type} message={status.message} instructions={status.instructions} action={new AlertAction(status.action.title, status.action.url)} />
    } else {
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
        <div className="panel panel-default participant-group-panel" data-participant-names={this.participantNames()}>
          <div className="list-group">
            {this.props.inMatchingParticipantGroup.participants.map(function (participant) {
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
  }
});
