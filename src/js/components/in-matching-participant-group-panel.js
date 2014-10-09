/** @jsx React.DOM */

var InMatchingParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      inMatchingParticipantGroups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          inMatchingParticipantGroups: data.in_matching_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId,
          inMatchingParticipantGroupPanels = this.state.inMatchingParticipantGroups.map(function (inMatchingParticipantGroup) {
        return (
          <InMatchingParticipantGroupPanel key={inMatchingParticipantGroup.id} data={inMatchingParticipantGroup} employerId={employerId} />
        );
      });

      return (
        <div id="participant-group-panels">
          {inMatchingParticipantGroupPanels}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
});

var InMatchingParticipantGroupPanel = React.createClass({
  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString('yyyy-MM-dd');
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            employer_id: this.props.employerId,
            in_matching_participant_group_id: this.props.data.id,
            expires_on: this.props.onReviewExpiresOn
          }
        };

    $.ajax({
        url: "/on_review_participant_groups.json",
        type: "POST",
        data: data,
        success: function(data) {
          React.unmountComponentAtNode(node);
          $(node).remove();
        },
        error: function(data) {
          window.location = window.location;
        }
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

    if (this.state.puttingOnReview) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
            <span className="btn btn-default" onClick={this.handleCancel}>Cancel</span>
          </div>
        </div>
        <div className="col-xs-12">
          <hr />
          <p className="panel-text">You will have until <strong>{this.props.onReviewExpiresOn}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{this.props.onReviewExpiresOn}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      </div>
    } else {
      actionRow = <div className="row">
        <div className="col-xs-6 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-6 col-sm-9">
          <button className="btn btn-success pull-right" onClick={this.handlePutOnReview}>Put on Review</button>
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
