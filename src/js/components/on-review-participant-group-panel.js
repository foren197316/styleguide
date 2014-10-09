/** @jsx React.DOM */

var OnReviewParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      employer: null,
      onReviewParticipantGroups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          employer: data.employer,
          onReviewParticipantGroups: data.on_review_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employer = this.state.employer,
          onReviewParticipantGroupPanels = this.state.onReviewParticipantGroups.map(function (onReviewParticipantGroup) {
        return (
          <OnReviewParticipantGroupPanel key={onReviewParticipantGroup.id} data={onReviewParticipantGroup} employer={employer} />
        );
      });

      return (
        <div id="participant-group-panels">
          {onReviewParticipantGroupPanels}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var OnReviewParticipantGroupPanel = React.createClass({
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
        participantPluralized = this.props.data.applications.length > 1 ? 'participants' : 'participant';
        applicationNodes = this.props.data.applications.map(function (application) {
        return (
          <ParticipantGroupApplication key={application.id} data={application} />
        )
      });

    actionRow = <div className="row">
      <div className="col-xs-3 col-sm-3">
        <div className="panel-title pull-left">{this.props.data.name}</div>
      </div>
      <div className="col-xs-9 col-sm-9">
        <div className="pull-right">
          <div className="btn-group clearfix">
            <button className="btn btn-success">Offer</button>
            <button className="btn btn-default">Decline</button>
          </div>
        </div>
      </div>
      <div className="col-xs-12 text-right">
        <hr />
        <p className="panel-text">You have until <strong>{this.props.data.expires_on}</strong> to make a choice.</p>
      </div>
    </div>

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
