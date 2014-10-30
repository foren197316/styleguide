var OfferedParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      offeredParticipantGroups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          offeredParticipantGroups: data.offered_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId,
          offeredParticipantGroupPanels = this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
        return (
          <OfferedParticipantGroupPanel key={offeredParticipantGroup.id} data={offeredParticipantGroup} employerId={employerId} />
        );
      });

      return (
        <div id="participant-group-panels">
          {offeredParticipantGroupPanels}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var OfferedParticipantGroupPanel = React.createClass({
  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString('yyyy-MM-dd');
  },

  render: function() {
    var actionRow,
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
      <div className="col-xs-3 col-sm-3">
        <div className="panel-title pull-left">{this.props.data.name}</div>
      </div>
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

var OfferedParticipantGroupParticipant = React.createClass({
  getInitialState: function () {
    return {};
  },

  render: function () {
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
            <div className="row">
              <div className="col-xs-12">
                <div>{this.props.draftJobOffer.position}</div>
                <div>{this.props.draftJobOffer.wage}</div>
                <div>{this.props.draftJobOffer.tipped}</div>
                <div>{this.props.draftJobOffer.hours}</div>
                <div>{this.props.draftJobOffer.overtime}</div>
                <div>{this.props.draftJobOffer.overtime_rate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
