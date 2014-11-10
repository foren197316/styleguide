var OfferedParticipantGroupPanel = React.createClass({
  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString('yyyy-MM-dd');
  },

  render: function() {
    var actionRow,
        createdAt = Date.parse(this.props.data.created_at).toString('yyyy-MM-dd'),
        draftJobOffers = this.props.data.draft_job_offers,
        participantNodes = this.props.data.participants.map(function (participant) {
          var draftJobOffer = draftJobOffers.filter(function (draft_job_offer) {
            return draft_job_offer.participant_id == participant.id;
          })[0];
          return (
            <OfferedParticipantGroupParticipant key={participant.id} data={participant} draftJobOffer={draftJobOffer} />
          )
        });

    actionRow = <div className="row">
      <div className="panel-title pull-left col-xs-3 col-sm-3">{this.props.data.name}</div>
      <div className="pull-right text-right col-xs-9 col-sm-9"><strong>Created {createdAt}</strong></div>
    </div>

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

var OfferedParticipantGroupPanels = React.createClass({
  mixins: [GroupPanelsMixin],
  resourceName: "offered_participant_groups",
  participantGroupPanelType: OfferedParticipantGroupPanel
});

var ReadOnlyFormGroup = React.createClass({
  render: function () {
    var label = this.props.label,
        value = this.props.value

    return (
      <div className="form-group">
        <label className="control-label col-sm-4">{label}</label>
        <span className="control-label col-sm-8" style={{"text-align": "left", "text-transform": "capitalize"}}>{value}</span>
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
        jobOfferLink = this.props.draftJobOffer.href
          ? <a href={this.props.draftJobOffer.href}>preview</a>
          : null;

    if (this.props.draftJobOffer.overtime === 'yes') {
      overtimeRate = (
        <ReadOnlyFormGroup label="Overtime rate per hour" value={"$" + parseInt(this.props.draftJobOffer.overtime_rate).toFixed(2)} />
      );
    }

    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={this.props.data.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.data.photo_url} alt="{this.props.data.name}" />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">
                  <LinkToParticipantName data={this.props.data} />
                </h4>
              </div>
            </div>
            <div className="form form-horizontal">
              <ReadOnlyFormGroup label="Position" value={this.props.draftJobOffer.position} />
              <ReadOnlyFormGroup label="Wage per hour" value={"$" + parseInt(this.props.draftJobOffer.wage).toFixed(2)} />
              <ReadOnlyFormGroup label="Tipped?" value={this.props.draftJobOffer.tipped ? 'Yes' : 'No'} />
              <ReadOnlyFormGroup label="Hours per week" value={this.props.draftJobOffer.hours} />
              <ReadOnlyFormGroup label="Overtime?" value={this.props.draftJobOffer.overtime} />
              {overtimeRate}
              <ReadOnlyFormGroup label="" value={jobOfferLink} />
            </div>
          </div>
        </div>
      </div>
    )
  }
});
