var OfferedParticipantGroupPanels = React.createClass({
  mixins: [React.addons.LinkedStateMixin, LoadResourceMixin],

  getInitialState: function () {
    return {};
  },

  componentDidMount: function() {
    var offeredParticipantGroupsPromise = this.loadResource("offeredParticipantGroups")();

    var participantsPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("participant_group_id"))
      .then(this.loadResource("participantGroups"))
      .then(this.extractIds("participant_ids"))
      .then(this.loadResource("participants"));

    var draftJobOffersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("draft_job_offer_ids"))
      .then(this.loadResource("draftJobOffers"));

    var jobOffersPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_ids"))
      .then(this.loadResource("jobOffers"));

    var jobOffersParticipantAgreementPromise =
      offeredParticipantGroupsPromise
      .then(this.extractIds("job_offer_participant_agreement_ids"))
      .then(this.loadResource("jobOfferParticipantAgreements"));

    this.loadAll([
      this.loadResource("employer")(),
      participantsPromise,
      draftJobOffersPromise,
      jobOffersPromise,
      jobOffersParticipantAgreementPromise,
      this.loadResource("programs")(),
      this.loadResource("positions")()
    ]).done();
  },

  renderLoaded: function () {
    var jobOffersLink = this.linkState("jobOffers");

    return (
      <div id="participant-group-panels">
        {this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
          var draftJobOffers = this.state.draftJobOffers.findById(offeredParticipantGroup.draft_job_offer_ids);
          var jobOfferParticipantAgreements = this.state.jobOfferParticipantAgreements.findById(offeredParticipantGroup.job_offer_participant_agreement_ids);
          var jobOffers = this.state.jobOffers.findById(offeredParticipantGroup.job_offer_ids);
          var participantGroup = this.state.participantGroups.findById(offeredParticipantGroup.participant_group_id);
          var participants = this.state.participants.findById(participantGroup.participant_ids);
          var program = this.state.programs.findById(participants[0].program_id);

          return (
            <OfferedParticipantGroupPanel
              draftJobOffers={draftJobOffers}
              employer={this.state.employer}
              jobOfferParticipantAgreements={jobOfferParticipantAgreements}
              jobOffers={jobOffers}
              jobOffersLink={jobOffersLink}
              key={"offered_participant_group_"+offeredParticipantGroup.id}
              offeredParticipantGroup={offeredParticipantGroup}
              participantGroup={participantGroup}
              participants={participants}
              positions={this.state.positions}
              program={program} />
          )
        }.bind(this))}
      </div>
    )
  },

  render: function() {
    return this.waitForLoadAll(this.renderLoaded);
  }
});

var OfferedParticipantGroupPanel = React.createClass({
  propTypes: {
    draftJobOffers: React.PropTypes.array.isRequired,
    employer: React.PropTypes.object.isRequired,
    jobOfferParticipantAgreements: React.PropTypes.array.isRequired,
    jobOffers: React.PropTypes.array.isRequired,
    jobOffersLink: React.PropTypes.object.isRequired, /* ReactLink */
    offeredParticipantGroup: React.PropTypes.object.isRequired,
    participantGroup: React.PropTypes.object.isRequired,
    participants: React.PropTypes.array.isRequired,
    positions: React.PropTypes.array.isRequired,
    program: React.PropTypes.object.isRequired,
    staff: React.PropTypes.object
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
    return this.props.jobOffers.length > 0;
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

    var node = this.getDOMNode(),
        url = null,
        data = {},
        success = null;

    if (this.state.sendingJobOffer) {
      url = "/offered_participant_groups/" + this.props.offeredParticipantGroup.id + "/job_offers.json";
      success = function(data) {
        this.props.jobOffersLink.requestChange(this.props.jobOffersLink.value.concat(data.job_offers));

        this.setState({
          sending: false,
          sendingJobOffer: false,
          rejecting: false
        });
      }.bind(this);
    } else if (this.state.rejecting) {
      url = "/offered_participant_groups/" + this.props.offeredParticipantGroup.id;
      data = { "_method": "DELETE" };
      success = function () {
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
    var actions,
        footerName = this.props.participantGroup.name + " - " + this.props.program.name,
        staffName = this.props.staff ? this.props.staff.name : null,
        hasJobOffers = this.hasJobOffers(),
        offers = hasJobOffers ? this.props.jobOffers : this.props.draftJobOffers,
        offerLinkTitle = hasJobOffers ? 'View' : 'Preview',
        participantNodes = offers.map(function (offer) {
          var participant = this.props.participants.findById(offer.participant_id);
          var position = this.props.positions.findById(offer.position_id);
          var jobOfferParticipantAgreement = this.props.jobOfferParticipantAgreements.findById(offer.id, "job_offer_id");

          return (
            <OfferedParticipantGroupParticipant
              key={participant.id}
              participant={participant}
              position={position}
              offer={offer}
              jobOfferParticipantAgreement={jobOfferParticipantAgreement}
              offerLinkTitle={offerLinkTitle} />
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
    } else if (hasJobOffers) {
      actions = <span className="label label-success">Sent</span>;
    } else if (!this.props.offeredParticipantGroup.can_send) {
      actions = null;
    } else if (!this.props.employer.vetted) {
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
            <a href={"/employers/" + this.props.employer.id + "/offered_participant_groups"}>
              {this.props.employer.name}
            </a>
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
        <ReadOnlyFormGroup label="Overtime rate per hour" value={"$" + parseFloat(this.props.offer.overtime_rate).toFixed(2)} />
      );
    }

    if (this.props.jobOfferParticipantAgreement !== null) {
      jobOfferParticipantAgreement = (
        <ReadOnlyFormGroup label="Signed by" value={this.props.jobOfferParticipantAgreement.full_name + " on " + Date.parse(this.props.jobOfferParticipantAgreement.created_at).toString(dateFormat)} />
      );
    }

    return (
      <ParticipantGroupItemWrapper participant={this.props.participant}>
        <div className="form form-horizontal">
          <ReadOnlyFormGroup label="Position" value={this.props.position.name} />
          <ReadOnlyFormGroup label="Wage per hour" value={"$" + parseFloat(this.props.offer.wage).toFixed(2)} />
          <ReadOnlyFormGroup label="Tipped?" value={this.props.offer.tipped ? 'Yes' : 'No'} />
          <ReadOnlyFormGroup label="Hours per week" value={this.props.offer.hours} />
          <ReadOnlyFormGroup label="Overtime?" value={this.props.offer.overtime.capitaliseWord()} />
          {overtimeRate}
          {jobOfferParticipantAgreement}
          <ReadOnlyFormGroup label="" value={jobOfferLink} />
        </div>
      </ParticipantGroupItemWrapper>
    )
  }
});
