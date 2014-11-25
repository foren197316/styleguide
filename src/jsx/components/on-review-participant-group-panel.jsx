var OnReviewParticipantGroupPanel = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      isOffering: false,
      isDeclining: false,
      draftJobOfferValid: false
    };
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var node = this.getDOMNode(),
        form = $(event.target),
        data = null,
        url = null;

    if (this.state.isOffering) {
      url = "/offered_participant_groups.json",
      data = {
        offered_participant_group: $.extend({
          employer_id: this.props.employerId,
          on_review_participant_group_id: this.props.data.id
        }, form.serializeJSON())
      };
    } else if (this.state.isDeclining) {
      url = "/on_review_participant_groups/" + this.props.data.id + ".json",
      data = {
        "_method": "DELETE",
        on_review_participant_group: form.serializeJSON()
      };
    } else {
      console.log('no action');
      return;
    }

    $.ajax({
      url: url,
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
    var isOfferingState         = this.linkState('isOffering'),
        isDecliningState        = this.linkState('isDeclining'),
        draftJobOfferValidState = this.linkState('draftJobOfferValid');

    return (
      <form className="panel panel-default participant-group-panel form-horizontal" role="form" onSubmit={this.handleSubmit}>
        <OnReviewParticipantGroupPanelHeading data={this.props.data} />
        <OnReviewParticipantGroupPanelListGroup data={this.props.data} isOfferingState={isOfferingState} isDecliningState={isDecliningState} draftJobOfferValidState={draftJobOfferValidState} />
        <OnReviewParticipantGroupPanelFooter data={this.props.data} isOfferingState={isOfferingState} isDecliningState={isDecliningState} draftJobOfferValidState={draftJobOfferValidState} />
      </form>
    )
  }
});

var OnReviewParticipantGroupPanels = React.createClass({
  mixins: [GroupPanelsMixin],
  resourceName: "on_review_participant_groups",
  participantGroupPanelType: OnReviewParticipantGroupPanel
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

/**
 * TODO:
 * Make PanelGroups wrap the Participant child nodes so we can reference them with this.props.children
 */
var OnReviewParticipantGroupPanelListGroup = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    draftJobOfferValidState: React.PropTypes.object.isRequired,
    isOfferingState: React.PropTypes.object.isRequired,
    isDecliningState: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    var state = {};

    for (var i=0; i<this.props.data.participants.length; i++) {
      state[this.stateName(i)] = false;
    }

    return state;
  },

  stateName: function (index) {
    return 'participantValid'+index.toString();
  },

  isFormValid: function () {
    for (var i=0; i<this.props.data.participants.length; i++) {
      if (!this.state[this.stateName(i)]) {
        return false;
      }
    }
    return true;
  },

  componentDidUpdate: function () {
    var valid = this.isFormValid();

    if (this.props.draftJobOfferValidState.value !== valid) {
      this.props.draftJobOfferValidState.requestChange(valid);
    }
  },

  render: function() {
    var participantNodes = this.props.data.participants.map(function (participant, i) {
          if (this.props.isOfferingState.value) {
            return (
              <ParticipantGroupParticipantOffering validationState={this.linkState(this.stateName(i))} key={participant.id} data={participant} />
            )
          } else if (this.props.isDecliningState.value) {
            return (
              <ParticipantGroupParticipantDeclining key={participant.id} data={participant} />
            )
          } else {
            return (
              <ParticipantGroupParticipant key={participant.id} data={participant} />
            )
          }
        }.bind(this));

    return (
      <div className="list-group">
        {participantNodes}
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooter = React.createClass({
  render: function() {
    var isOfferingState = this.props.isOfferingState,
        isDecliningState = this.props.isDecliningState,
        draftJobOfferValidState = this.props.draftJobOfferValidState,
        buttonGroup = (function (participant) {
          if (isOfferingState.value) {
            return <OnReviewParticipantGroupPanelFooterButtonsConfirmCancel data={participant} draftJobOfferValidState={draftJobOfferValidState} isOfferingState={isOfferingState} />;
          } else if (isDecliningState.value) {
            return <OnReviewParticipantGroupPanelFooterButtonsDeclineCancel data={participant} isDecliningState={isDecliningState} />;
          } else {
            return <OnReviewParticipantGroupPanelFooterButtonsOfferDecline data={participant} isOfferingState={isOfferingState} isDecliningState={isDecliningState} />;
          }
        })(),
        legalese = (function (participant) {
          if (isOfferingState.value) {
            return (
              <small>
                By clicking offer I agree that the information entered is true and accurate to the best of my knowledge and that I will contact InterExchange if any information changes.
              </small>
            )
          } else if (isDecliningState.value) {
            return <span>Are you sure you want to decline this participant?</span>;
          }
        })();

    return (
      <ParticipantGroupPanelFooter name={this.props.data.name}>
        {buttonGroup}
        {legalese}
      </ParticipantGroupPanelFooter>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsOfferDecline = React.createClass({
  offerClick: function () {
    this.props.isOfferingState.requestChange(!this.props.isOfferingState.value);
  },

  declineClick: function () {
    this.props.isDecliningState.requestChange(!this.props.isDecliningState.value);
  },

  render: function() {
    return (
      <div className="btn-group clearfix">
        <button className="btn btn-success" onClick={this.offerClick}>Offer</button>
        <button className="btn btn-danger" onClick={this.declineClick}>Decline</button>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsConfirmCancel = React.createClass({
  onClick: function () {
    this.props.isOfferingState.requestChange(!this.props.isOfferingState.value);
  },

  render: function() {
    var confirmButton = this.props.draftJobOfferValidState.value
      ? <input className="btn btn-success" type="submit" value="Confirm" />
      : <input className="btn btn-success" type="submit" value="Confirm" disabled="disabled" />;

    return (
      <div className="btn-group clearfix">
        {confirmButton}
        <button className="btn btn-default" onClick={this.onClick}>Cancel</button>
      </div>
    )
  }
});

var OnReviewParticipantGroupPanelFooterButtonsDeclineCancel = React.createClass({
  onClick: function () {
    this.props.isDecliningState.requestChange(!this.props.isDecliningState.value);
  },

  render: function () {
    return (
      <div className="btn-group clearfix">
        <input className="btn btn-danger" type="submit" value="Decline" />
        <button className="btn btn-default" onClick={this.onClick}>Cancel</button>
      </div>
    )
  }
});
