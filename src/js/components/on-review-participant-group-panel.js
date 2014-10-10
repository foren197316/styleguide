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
  getInitialState: function() {
    return { isOffering: false };
  },

  handleDoOffer: function(event) {
    this.setState({ isOffering: true });
  },

  handleCancelOffer: function(event) {
    this.setState({ isOffering: false });
  },

  render: function() {
    return (
      <div className="panel panel-default participant-group-panel">
        <OnReviewParticipantGroupPanelHeading data={this.props.data} isOffering={this.state.isOffering} />
        <OnReviewParticipantGroupPanelListGroup data={this.props.data} isOffering={this.state.isOffering} />
        <OnReviewParticipantGroupPanelFooter data={this.props.data} isOffering={this.state.isOffering} handleDoOffer={this.handleDoOffer} handleCancelOffer={this.handleCancelOffer} />
      </div>
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
        applicationNodes = this.props.data.applications.map(function (application) {
          if (!isOffering) {
            return (
              <ParticipantGroupApplication key={application.id} data={application} />
            )
          } else {
            return (
              <ParticipantGroupApplicationOffering key={application.id} data={application} />
            )
          }
        });

    return (
      <div className="list-group">
        {applicationNodes}
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooter = React.createClass({
  propogateDoOffer: function () {
    this.props.handleDoOffer(this);
  },

  propogateCancelOffer: function () {
    this.props.handleCancelOffer(this);
  },

  render: function() {
    var isOffering = this.props.isOffering,
        propogateDoOffer = this.propogateDoOffer,
        propogateCancelOffer = this.propogateCancelOffer,
        buttonGroup = (function (application) {
          if (!isOffering) {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsOfferDecline data={application} handleDoOffer={propogateDoOffer} />
            )
          } else {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsConfirmCancel data={application} handleCancelOffer={propogateCancelOffer} />
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
  propogateDoOffer: function () {
    this.props.handleDoOffer(this);
  },

  render: function() {
    return (
      <div className="btn-group clearfix">
        <button className="btn btn-success" onClick={this.propogateDoOffer}>Offer</button>
        <button className="btn btn-danger">Decline</button>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({
  propogateCancelOffer: function () {
    this.props.handleCancelOffer(this);
  },

  render: function() {
    return (
      <div className="btn-group clearfix">
        <button className="btn btn-success">Confirm</button>
        <button className="btn btn-default" onClick={this.propogateCancelOffer}>Cancel</button>
      </div>
    )
  }
});
