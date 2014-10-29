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
        <OfferedParticipantGroupPanelListGroup data={this.props.data} isOffering={this.state.isOffering} draftJobOfferValid={this.state.draftJobOfferValid} toggleDraftJobOfferValid={this.toggleDraftJobOfferValid}  />
        <OfferedParticipantGroupPanelFooter data={this.props.data} draftJobOfferValid={this.state.draftJobOfferValid} isOffering={this.state.isOffering} toggleIsOffering={this.toggleIsOffering} />
      </form>
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
        </div>
        {legalize}
      </div>
    )
  }
});
