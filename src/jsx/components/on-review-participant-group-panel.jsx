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
  getInitialState: function() {
    return { isOffering: false };
  },

  toggleIsOffering: function(event) {
    this.setState({ isOffering: !this.state.isOffering });
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var form = $(event.target),
        data = form.serialize();

    $.ajax({
      url: "/on_review_participant_groups/" + this.props.key + "/confirm.json",
      type: "POST",
      data: data,
      success: function(data) {
        React.unmountComponentAtNode(node);
        $(node).remove();
      },
      error: function(data) {
        console.log(data);
      }
    });
  },

  render: function() {
    return (
      <form className="panel panel-default participant-group-panel form-horizontal" role="form" onSubmit={this.handleSubmit}>
        <OnReviewParticipantGroupPanelHeading data={this.props.data} isOffering={this.state.isOffering} />
        <OnReviewParticipantGroupPanelListGroup data={this.props.data} isOffering={this.state.isOffering} />
        <OnReviewParticipantGroupPanelFooter data={this.props.data} isOffering={this.state.isOffering} toggleIsOffering={this.toggleIsOffering} />
      </form>
    )
  }
});

var OnReviewParticipantGroupPanelHeading = React.createClass({
  render: function() {
    return (
      <div className="panel-heading text-right">
        <h1 className="panel-title">On Review until <strong>{this.props.data.expires_on}</strong></h1>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelListGroup = React.createClass({
  render: function() {
    var isOffering = this.props.isOffering,
        participantNodes = this.props.data.participants.map(function (participant) {
          if (!isOffering) {
            return (
              <ParticipantGroupParticipant key={participant.id} data={participant} />
            )
          } else {
            return (
              <ParticipantGroupParticipantOffering key={participant.id} data={participant} />
            )
          }
        });

    return (
      <div>
        {participantNodes}
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooter = React.createClass({
  propogateToggleIsOffering: function () {
    this.props.toggleIsOffering(this);
  },

  render: function() {
    var isOffering = this.props.isOffering,
        propogateToggleIsOffering = this.props.toggleIsOffering,
        buttonGroup = (function (participant) {
          if (!isOffering) {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsOfferDecline data={participant} toggleIsOffering={propogateToggleIsOffering} />
            )
          } else {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsConfirmCancel data={participant} toggleIsOffering={propogateToggleIsOffering} />
            )
          }
        })();

    return (
      <div className="panel-footer clearfix">
        <div className="row">
          <div className="col-xs-3 col-sm-3">
            <div className="panel-title pull-left">{this.props.data.name}</div>
          </div>
          <div className="col-xs-9 col-sm-9">
            <div className="pull-right">
              {buttonGroup}
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsOfferDecline = React.createClass({
  propogateToggleIsOffering: function () {
    this.props.toggleIsOffering(this);
  },

  render: function() {
    return (
      <div className="btn-group clearfix">
        <button className="btn btn-success" onClick={this.propogateToggleIsOffering}>Offer</button>
        <button className="btn btn-danger">Decline</button>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({
  propogateToggleIsOffering: function () {
    this.props.toggleIsOffering(this);
  },

  render: function() {
    return (
      <div className="btn-group clearfix">
        <input className="btn btn-success" type="submit" value="Confirm" />
        <button className="btn btn-default" onClick={this.propogateToggleIsOffering}>Cancel</button>
      </div>
    )
  }
});
