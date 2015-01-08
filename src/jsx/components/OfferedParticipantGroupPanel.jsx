var OfferedParticipantGroupPanel = React.createClass({
  propTypes: {
    offeredParticipantGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      puttingOnReview: false,
      rejecting: false,
      sending: false,
      sendingJobOffer: false
    };
  },

  hasJobOffers: function () {
    return this.props.offeredParticipantGroup.job_offers.length > 0;
  },

  handleSendToParticipant: function (event) {
    this.setState({ sendingJobOffer: true });
  },

  handleReject: function () {
    this.setState({ rejecting: true });
  },

  handleCancel: function(event) {
    this.setState({ sendingJobOffer: false, rejecting: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode();

    if (this.state.sendingJobOffer) {
      JobOfferGroupActions.create({ offered_participant_group_id: this.props.offeredParticipantGroup.id }, function (response) {
        this.setState({ status: response.responseJSON.status });
      }.bind(this));
    } else if (this.state.rejecting) {
      OfferedParticipantGroupActions.reject(this.props.offeredParticipantGroup.id, function () {
        React.unmountComponentAtNode(node);
        $(node).remove();
      });
    }
  },

  render: function() {
    var actions,
        footerName = this.props.offeredParticipantGroup.name,
        employer = EmployerStore.findById(this.props.offeredParticipantGroup.employer_id),
        staff = StaffStore.findById(employer.staff_id),
        staffName = staff ? staff.name : null,
        draftJobOffers = this.props.offeredParticipantGroup.draft_job_offers,
        participants = this.props.offeredParticipantGroup.participants,
        participantNodes = draftJobOffers.map(function (draftJobOffer) {
          var participant = participants.findById(draftJobOffer.participant_id);
          var position = PositionStore.findById(draftJobOffer.position_id);

          return (
            <OfferedParticipantGroupParticipant
              key={participant.id}
              participant={participant}
              position={position}
              offer={draftJobOffer}
              offerLinkTitle="Preview" />
          )
        }.bind(this));

    if (this.state.status) {
      var status = this.state.status;
      return <Alert type={status.type} message={status.message} instructions={status.instructions} action={new AlertAction(status.action.title, status.action.url)} />
    } else if (this.state.sendingJobOffer) {
      actions = (
        <div className="btn-group">
          <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
        </div>
      )
    } else if (this.state.rejecting) {
      actions = (
        <div className="btn-group">
          <button className="btn btn-danger" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
        </div>
      )
    } else if (!this.props.offeredParticipantGroup.can_send) {
      actions = null;
    } else if (!employer.vetted) {
      actions = (
        <div>
          <span className="label label-warning pull-left">Employer Not Vetted</span>
          <button className="btn btn-small btn-danger" onClick={this.handleReject}>Reject</button>
        </div>
      )
    } else {
      actions = (
        <div className="btn-group">
          <button className="btn btn-success" onClick={this.handleSendToParticipant}>Send to Participant</button>
          <button className="btn btn-danger" onClick={this.handleReject}>Reject</button>
        </div>
      )
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <EmployerHeader employer={employer} />
        <div className="list-group">
          {participantNodes}
        </div>
        <ParticipantGroupPanelFooter name={footerName}>
          {actions}
        </ParticipantGroupPanelFooter>
      </div>
    )
  }
});
