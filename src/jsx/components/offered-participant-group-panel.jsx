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

var OfferedParticipantGroupParticipant = React.createClass({
  getInitialState: function () {
    return {};
  },

  render: function () {
    var overtimeRate = null;

    if (this.props.draftJobOffer.overtime_rate) {
      overtimeRate = (
        <div>
          <dt>Overtime rate per hour</dt>
          <dd>${parseInt(this.props.draftJobOffer.overtime_rate).toFixed(2)}</dd>
        </div>
      );
    }

    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={this.props.data.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.data.photo_url} alt="{this.props.data.name}" />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">{this.props.data.name}</h4>
              </div>
            </div>
            <dl className="dl-horizontal pull-right">
              <dt>Position</dt>
              <dd>{this.props.draftJobOffer.position}</dd>
              <dt>Wage per hour</dt>
              <dd>${parseInt(this.props.draftJobOffer.wage).toFixed(2)}</dd>
              <dt>Tipped?</dt>
              <dd>{this.props.draftJobOffer.tipped ? 'Yes' : 'No'}</dd>
              <dt>Hours per week</dt>
              <dd>{this.props.draftJobOffer.hours}</dd>
              <dt>Overtime?</dt>
              <dd>{this.props.draftJobOffer.overtime}</dd>
              {overtimeRate}
            </dl>
          </div>
        </div>
      </div>
    )
  }
});
