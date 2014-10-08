/** @jsx React.DOM */

var OnReviewParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      employer: null,
      participant_groups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          employer: data.employer,
          participant_groups: data.participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employer = this.state.employer,
          participantGroupNodes = this.state.participant_groups.map(function (participantGroup) {
        return (
          <OnReviewParticipantGroup key={participantGroup.id} data={participantGroup} employer={employer} />
        );
      });

      return (
        <div id="participant-group-panels">
          {participantGroupNodes}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var OnReviewParticipantGroup = React.createClass({
  getInitialState: function() {
    return { puttingOnReview: false };
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function(event) {
    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            employer_id: this.props.employer.id,
            participant_group_id: this.props.data.participant_group_id
          }
        };

    $.post("/on_review_participant_groups.json", data, function(data) {
      React.unmountComponentAtNode(node);
      $(node).remove();
    });
  },

  render: function() {
    var actionRow,
        putOnReviewEndDate = Date.today().add(3).days().toString('yyyy-MM-dd'),
        participantPluralized = this.props.data.applications.length > 1 ? 'participants' : 'participant';
        applicationNodes = this.props.data.applications.map(function (application) {
        return (
          <ParticipantGroupApplication key={application.id} data={application} />
        )
      });

    if (this.state.puttingOnReview) {
      actionRow = <div className="row">
        <div className="col-xs-6 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-6 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm}>Confirm</button>
            <span className="btn btn-default" onClick={this.handleCancel}>Cancel</span>
          </div>
        </div>
        <div className="col-xs-12">
          <hr />
          <p className="panel-text">You will have until <strong>{putOnReviewEndDate}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{putOnReviewEndDate}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      </div>
    } else {
      actionRow = <div className="row">
        <div className="col-xs-6 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-6 col-sm-9">
          <div className="btn-group pull-right">
            <button className="btn btn-success" onClick={this.handleOffer}>Offer</button>
            <button className="btn btn-danger" onClick={this.handleReject}>Reject</button>
          </div>
        </div>
      </div>
  }

  return (
    <div className="panel participant-group-panel">
      <div className="list-group">
          {applicationNodes}
        </div>
        <div className="panel-footer clearfix">
          {actionRow}
        </div>
      </div>
    )
  }
});
