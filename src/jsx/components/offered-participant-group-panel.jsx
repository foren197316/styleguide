var OfferedParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      employer: null,
      offeredParticipantGroups: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          employer: data.employer,
          offeredParticipantGroups: data.offered_participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employer = this.state.employer,
          offeredParticipantGroupPanels = this.state.offeredParticipantGroups.map(function (offeredParticipantGroup) {
            return (
              <OfferedParticipantGroupPanel key={offeredParticipantGroup.id} data={offeredParticipantGroup} employer={employer} />
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
    return {
      isOffering: false,
      draftJobOfferValid: false
    };
  },

  toggleIsOffering: function(event) {
    this.setState({ isOffering: !this.state.isOffering });
  },

  toggleDraftJobOfferValid: function () {
    this.setState({draftJobOfferValid: !this.state.draftJobOfferValid});
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var node = this.getDOMNode(),
        form = $(event.target),
        data = form.serialize();

    $.ajax({
      url: "/offered_participant_groups/" + this.props.key + "/confirm.json",
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
        <OfferedParticipantGroupPanelHeading data={this.props.data} isOffering={this.state.isOffering} />
        <OfferedParticipantGroupPanelListGroup data={this.props.data} isOffering={this.state.isOffering} draftJobOfferValid={this.state.draftJobOfferValid} toggleDraftJobOfferValid={this.toggleDraftJobOfferValid}  />
        <OfferedParticipantGroupPanelFooter data={this.props.data} draftJobOfferValid={this.state.draftJobOfferValid} isOffering={this.state.isOffering} toggleIsOffering={this.toggleIsOffering} />
      </form>
    )
  }
});

var OfferedParticipantGroupPanelHeading = React.createClass({
  render: function() {
    return (
      <div className="panel-heading text-right">
        <h1 className="panel-title">On Review until <strong>{this.props.data.expires_on}</strong></h1>
      </div>
    )
  }
});

var OfferedParticipantGroupPanelListGroup = React.createClass({
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
        nodeNumber = 0,
        updateNodeStatus = this.updateNodeStatus,
        draftJobOfferValid = this.props.draftJobOfferValid,
        participantNodes = this.props.data.participants.map(function (participant) {
          if (!isOffering) {
            return (
              <ParticipantGroupParticipant key={participant.id} data={participant} />
            )
          } else {
            return (
              <ParticipantGroupParticipantOffering draftJobOfferValid={draftJobOfferValid} updateNodeStatus={updateNodeStatus} nodeNumber={nodeNumber++} key={participant.id} data={participant} />
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

var OfferedParticipantGroupPanelFooter = React.createClass({
  propogateToggleIsOffering: function () {
    this.props.toggleIsOffering(this);
  },

  render: function() {
    var isOffering = this.props.isOffering,
        propogateToggleIsOffering = this.props.toggleIsOffering,
        draftJobOfferValid = this.props.draftJobOfferValid,
        buttonGroup = (function (participant) {
          if (!isOffering) {
            return (
              <OfferedParticipantGroupPanelFooterButtonsOfferDecline data={participant} toggleIsOffering={propogateToggleIsOffering} />
            )
          } else {
            return (
              <OfferedParticipantGroupPanelFooterButtonsConfirmCancel data={participant} draftJobOfferValid={draftJobOfferValid} toggleIsOffering={propogateToggleIsOffering} />
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

var OfferedParticipantGroupPanelFooterButtonsOfferDecline = React.createClass({
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

var OfferedParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({
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
