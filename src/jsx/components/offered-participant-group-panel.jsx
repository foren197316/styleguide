var OfferedParticipantGroupPanels = React.createClass({
  getInitialState: function () {
    return { groups: null };
  },

  componentDidMount: function() {
    if (! this.state.groups) {
      $.get(this.props.source, function(data) {
        if (this.isMounted()) {
          this.setState({
            groups: data.offered_participant_groups
          });
        }
      }.bind(this));
    }
  },

  render: function() {
    if (this.isMounted()) {
      var staffIdState = this.props.staffIdState,
          groupPanels = this.state.groups.filter(function (offeredParticipantGroup) {
            if (staffIdState === undefined) {
              return true;
            } else {
              if (staffIdState.value === "") {
                return true;
              } else if (staffIdState.value === "-1" && offeredParticipantGroup.staff === null) {
                return true;
              } else if (offeredParticipantGroup.staff !== null && parseInt(offeredParticipantGroup.staff.id) === parseInt(staffIdState.value)) {
                return true;
              }
            }

            return false;
          }).map(function (group) {
            return (
              <OfferedParticipantGroupPanel key={group.id} data={group} />
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
        participants = this.props.data.participants,
        participantNodes = this.props.data.draft_job_offers.map(function (draftJobOffer) {
          var participant = participants.filter(function (participant) {
            return draftJobOffer.participant_id == participant.id;
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
        <div className="panel-heading">
          <h1 className="panel-title">
            <a href={"/employers/" + this.props.data.employer.id + "/offered_participant_groups"}>
              {this.props.data.employer.name}
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
