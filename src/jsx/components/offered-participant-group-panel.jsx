var OfferedParticipantGroupPanels = React.createClass({
  getInitialState: function () {
    return { groups: null };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data.offered_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var staffIdState = this.props.staffIdState,
          groupPanels = this.state.groups.map(function(group) {
            return (
              <OfferedParticipantGroupPanel data={group} />
            )
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

var OfferedParticipantGroupPanel = React.createClass({
  getInitialState: function() {
    return {
      sending: false,
      puttingOnReview: false,
      sendingJobOffer: false,
      rejecting: false,
      data: this.props.data
    };
  },

  hasJobOffers: function () {
    return this.state.data.job_offers.length > 0;
  },

  handleSendToParticipant: function (event) {
    this.setState({ sendingJobOffer: true });
  },

  handleReject: function () {
    this.setState({ rejecting: true });
  },

  handleCancel: function(event) {
    this.setState({ sendingJobOffer: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        url = null,
        data = {},
        success = null;

    if (this.state.sendingJobOffer) {
      url = "/offered_participant_groups/" + this.state.data.id + "/job_offers.json";
      success = function(data) {
        this.setState({ data: data.offered_participant_group, sending: false, sendingJobOffer: false, rejecting: false });
      }.bind(this);
    } else if (this.state.rejecting) {
      url = "/offered_participant_groups/" + this.state.data.id;
      data = {
        "_method": "DELETE"
      };
      success = function (data) {
        React.unmountComponentAtNode(node);
        $(node).remove();
      };
    }

    $.ajax({
      url: url,
      type: "POST",
      data: data,
      success: success,
      error: function(data) {
        window.location = window.location;
      }
    });
  },

  render: function() {
    var actionRow,
        participants = this.state.data.participants,
        jobOfferParticipantAgreements = this.state.data.job_offer_participant_agreements,
        staffName = this.state.data.staff ? this.state.data.staff.name : null,
        hasJobOffers = this.hasJobOffers(),
        offers = hasJobOffers ? this.state.data.job_offers : this.state.data.draft_job_offers,
        offerLinkTitle = hasJobOffers ? 'View' : 'Preview',
        participantNodes = offers.map(function (offer) {
          var participant = participants.filter(function (participant) {
            return offer.participant_id == participant.id;
          })[0];
          var jobOfferParticipantAgreement = hasJobOffers
            ? jobOfferParticipantAgreements.filter(function (jobOfferParticipantAgreement) {
                return offer.id == jobOfferParticipantAgreement.job_offer_id;
              })[0] || null
            : null;

          return (
            <OfferedParticipantGroupParticipant key={participant.id} participant={participant} offer={offer} jobOfferParticipantAgreement={jobOfferParticipantAgreement} offerLinkTitle={offerLinkTitle} />
          )
        });

    if (this.state.sendingJobOffer) {
      actionRow = (
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.state.data.name}</div>
          </div>
          <div className="col-xs-9 col-sm-9">
            <div className="btn-group clearfix pull-right">
              <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
              <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )
    } else if (this.state.rejecting) {
      actionRow = (
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.state.data.name}</div>
          </div>
          <div className="col-xs-9 col-sm-9">
            <div className="btn-group clearfix pull-right">
              <button className="btn btn-danger" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
              <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )
    } else if (this.hasJobOffers()) {
      actionRow = (
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.state.data.name}</div>
          </div>
          <div className="col-xs-9 col-sm-9">
            <div className="pull-right"><span className="label label-success">Sent</span></div>
          </div>
        </div>
      )
    } else if (!this.state.data.employer.vetted) {
      actionRow = (
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.state.data.name}</div>
          </div>
          <div className="col-xs-9 col-sm-9">
            <div className="pull-right"><span className="label label-warning">Employer Not Vetted</span></div>
          </div>
        </div>
      )
    } else if (!this.state.data.can_send) {
      actionRow = (
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.state.data.name}</div>
          </div>
        </div>
      )
    } else {
      actionRow = (
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.state.data.name}</div>
          </div>
          <div className="col-xs-9 col-sm-9">
            <div className="btn-group pull-right">
              <button className="btn btn-success" onClick={this.handleSendToParticipant}>Send to Participant</button>
              <button className="btn btn-danger" onClick={this.handleReject}>Reject</button>
            </div>
          </div>
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
            <a href={"/employers/" + this.state.data.employer.id + "/offered_participant_groups"}>
              {this.state.data.employer.name}
            </a>
          </h1>
        </div>
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

var OfferedParticipantGroupParticipant = React.createClass({
  getInitialState: function () {
    return {};
  },

  render: function () {
    var overtimeRate = null,
        jobOfferParticipantAgreement = null,
        jobOfferLink = this.props.offer.href
          ? <a href={this.props.offer.href}>{this.props.offerLinkTitle}</a>
          : null;

    if (this.props.offer.overtime === 'yes') {
      overtimeRate = (
        <ReadOnlyFormGroup label="Overtime rate per hour" value={"$" + parseInt(this.props.offer.overtime_rate).toFixed(2)} />
      );
    }

    if (this.props.jobOfferParticipantAgreement !== null) {
      jobOfferParticipantAgreement = (
        <ReadOnlyFormGroup label="Signed by" value={this.props.jobOfferParticipantAgreement.full_name + " on " + Date.parse(this.props.jobOfferParticipantAgreement.created_at).toString(dateFormat)} />
      );
    }

    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={this.props.participant.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.participant.photo_url} alt={this.props.participant.name} />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">
                  <LinkToParticipantName data={this.props.participant} />
                </h4>
              </div>
            </div>
            <div className="form form-horizontal">
              <ReadOnlyFormGroup label="Position" value={this.props.offer.position} />
              <ReadOnlyFormGroup label="Wage per hour" value={"$" + parseInt(this.props.offer.wage).toFixed(2)} />
              <ReadOnlyFormGroup label="Tipped?" value={this.props.offer.tipped ? 'Yes' : 'No'} />
              <ReadOnlyFormGroup label="Hours per week" value={this.props.offer.hours} />
              <ReadOnlyFormGroup label="Overtime?" value={capitaliseWord(this.props.offer.overtime)} />
              {overtimeRate}
              {jobOfferParticipantAgreement}
              <ReadOnlyFormGroup label="" value={jobOfferLink} />
            </div>
          </div>
        </div>
      </div>
    )
  }
});
