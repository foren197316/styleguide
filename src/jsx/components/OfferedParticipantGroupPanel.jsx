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
      JobOfferActions.send(this.props.offeredParticipantGroup.id, function () {
        this.setState({
          sending: false,
          sendingJobOffer: false,
          rejecting: false
        });
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
        staffName = this.props.offeredParticipantGroup.employer.staff ? this.props.offeredParticipantGroup.employer.staff.name : null,
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

    if (this.state.sendingJobOffer) {
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
    } else if (!this.props.offeredParticipantGroup.employer.vetted) {
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
        <div className="panel-heading">
          <h1 className="panel-title">
            <span className="pull-right text-muted">
              {staffName}
            </span>
            <LinkToIf name={this.props.offeredParticipantGroup.employer.name} href={this.props.offeredParticipantGroup.employer.href} />
          </h1>
        </div>
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
