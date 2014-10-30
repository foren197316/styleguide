var OnReviewParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      onReviewParticipantGroups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          onReviewParticipantGroups: data.on_review_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId,
          onReviewParticipantGroupPanels = this.state.onReviewParticipantGroups.map(function (onReviewParticipantGroup) {
            return (
              <OnReviewParticipantGroupPanel key={onReviewParticipantGroup.id} data={onReviewParticipantGroup} employerId={employerId} />
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
    return {
      isOffering: false,
      isDeclining: false,
      draftJobOfferValid: false
    };
  },

  toggleIsOffering: function(event) {
    this.setState({ isOffering: !this.state.isOffering });
  },

  toggleIsDeclining: function(event) {
    this.setState({ isDeclining: !this.state.isDeclining });
  },

  toggleDraftJobOfferValid: function () {
    this.setState({draftJobOfferValid: !this.state.draftJobOfferValid});
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var node = this.getDOMNode(),
        form = $(event.target),
        data = {
          offered_participant_group: $.extend({
            employer_id: this.props.employerId,
            on_review_participant_group_id: this.props.data.id
          }, form.serializeJSON())
        };

    $.ajax({
      url: "/offered_participant_groups.json",
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
        <OnReviewParticipantGroupPanelListGroup data={this.props.data} isOffering={this.state.isOffering} isDeclining={this.state.isDeclining} propogateToggleIsDeclining={this.toggleIsDeclining} draftJobOfferValid={this.state.draftJobOfferValid} toggleDraftJobOfferValid={this.toggleDraftJobOfferValid}  />
        <OnReviewParticipantGroupPanelFooter data={this.props.data} draftJobOfferValid={this.state.draftJobOfferValid} isOffering={this.state.isOffering} isDeclining={this.state.isDeclining} toggleIsOffering={this.toggleIsOffering} toggleIsDeclining={this.toggleIsDeclining} />
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
  getInitialState: function () {
    var participantCount = this.props.data.participants.length,
        participantValidationStatuses = [];

    for (var i=0; i<participantCount; i++) {
      participantValidationStatuses.push(false);
    }

    return { "participantValidationStatuses": participantValidationStatuses };
  },

  isFormValid: function () {
    return this.state.participantValidationStatuses.reduce(function (prev, curr) {
      return prev && curr;
    });
  },

  updateNodeStatus: function (nodeNumber, isValid) {
    var participantValidationStatuses = this.state.participantValidationStatuses,
        oldStatus = this.isFormValid();

    participantValidationStatuses[nodeNumber] = isValid;
    this.setState({"participantValidationStatuses": participantValidationStatuses});

    if (oldStatus !== this.isFormValid()) {
      this.props.toggleDraftJobOfferValid();
    }
  },

  render: function() {
    var isOffering = this.props.isOffering,
        isDeclining = this.props.isDeclining,
        propogateToggleIsDeclining = this.props.propogateToggleIsDeclining,
        nodeNumber = 0,
        updateNodeStatus = this.updateNodeStatus,
        draftJobOfferValid = this.props.draftJobOfferValid,
        participantNodes = this.props.data.participants.map(function (participant) {
          if (isOffering) {
            return (
              <ParticipantGroupParticipantOffering draftJobOfferValid={draftJobOfferValid} updateNodeStatus={updateNodeStatus} nodeNumber={nodeNumber++} key={participant.id} data={participant} />
            )
          } else if (isDeclining) {
            return (
              <ParticipantGroupParticipantDeclining key={participant.id} propogateToggleIsDeclining={propogateToggleIsDeclining} data={participant} />
            )
          } else {
            return (
              <ParticipantGroupParticipant key={participant.id} data={participant} />
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
  render: function() {
    var isOffering = this.props.isOffering,
        isDeclining = this.props.isDeclining,
        propogateToggleIsOffering = this.props.toggleIsOffering,
        propogateToggleIsDeclining = this.props.toggleIsDeclining,
        draftJobOfferValid = this.props.draftJobOfferValid,
        buttonGroup = (function (participant) {
          if (isOffering) {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsConfirmCancel data={participant} draftJobOfferValid={draftJobOfferValid} toggleIsOffering={propogateToggleIsOffering} />
            )
          } else if (isDeclining) {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsDeclineCancel data={participant} toggleIsDeclining={propogateToggleIsDeclining} />
            )
          } else {
            return (
              <OnReviewParticipantGroupPanelFooterButtonsOfferDecline data={participant} toggleIsOffering={propogateToggleIsOffering} toggleIsDeclining={propogateToggleIsDeclining} />
            )
          }
        })(),
        legalize = (function (participant) {
          if (isOffering) {
            return (
              <div className="row">
                <hr/>
                <small className="col-xs-12 text-right">
                  By clicking offer I agree that the information entered is true and accurate to the best of my knowledge and that I will contact InterExchange if any information changes.
                </small>
              </div>
            )
          } else if (isDeclining) {
            return (
              <div className="row">
                <hr/>
                <small className="col-xs-12 text-right">
                  Are you sure you wish to cancel this participant?
                </small>
              </div>
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
        {legalize}
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsOfferDecline = React.createClass({
  propogateToggleIsOffering: function () {
    this.props.toggleIsOffering(this);
  },

  propogateToggleIsDeclining: function () {
    this.props.toggleIsDeclining(this);
  },

  render: function() {
    return (
      <div className="btn-group clearfix">
        <button className="btn btn-success" onClick={this.propogateToggleIsOffering}>Offer</button>
        <button className="btn btn-danger" onClick={this.propogateToggleIsDeclining}>Decline</button>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({
  propogateToggleIsOffering: function () {
    this.props.toggleIsOffering(this);
  },

  render: function() {
    var confirmButton = this.props.draftJobOfferValid
      ? <input className="btn btn-success" type="submit" value="Confirm" />
      : <input className="btn btn-success" type="submit" value="Confirm" disabled="disabled" />;

    return (
      <div className="btn-group clearfix">
        {confirmButton}
        <button className="btn btn-default" onClick={this.propogateToggleIsOffering}>Cancel</button>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsDeclineCancel = React.createClass({
  propogateToggleIsDeclining: function () {
    this.props.toggleIsDeclining(this);
  },

  render: function () {
    return (
      <div className="btn-group clearfix">
        <input className="btn btn-success" type="submit" value="Confirm" />
        <button className="btn btn-default" onClick={this.propogateToggleIsDeclining}>Cancel</button>
      </div>
    )
  }
});
