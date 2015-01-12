var JobOfferGroup = React.createClass({
  propTypes: {
    jobOfferGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  handleReject: function () {
    this.setState({ rejecting: true });
  },

  handleCancel: function(event) {
    this.setState({ rejecting: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode();

    JobOfferGroupActions.destroy(this.props.jobOfferGroup.id);
  },

  render: function () {
    var actions = null;

    if (this.state.rejecting) {
      actions = (
        <div className="btn-group">
          <button className="btn btn-danger" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
        </div>
      )
    } else if (this.props.jobOfferGroup.can_reject) {
      actions = (
        <button className="btn btn-small btn-danger" onClick={this.handleReject}>Reject</button>
      )
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <EmployerHeader employer_id={this.props.jobOfferGroup.employer_id} />
        <div className="list-group">
          {this.props.jobOfferGroup.job_offers.map(function (jobOffer) {
            return <JobOffer jobOffer={jobOffer} key={"job_offer_"+jobOffer.id} />;
          })}
        </div>
        <ParticipantGroupPanelFooter name={this.props.jobOfferGroup.name}>
          {actions}
        </ParticipantGroupPanelFooter>
      </div>
    )
  }
});
