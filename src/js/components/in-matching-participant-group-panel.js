/** @jsx React.DOM */
var InMatchingParticipantGroupPanel = React.createClass({displayName: 'InMatchingParticipantGroupPanel',
  propTypes: {
    employer: React.PropTypes.object.isRequired,
    enrollment: React.PropTypes.object.isRequired,
    inMatchingParticipantGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      sending: false,
      puttingOnReview: false,
      onReviewExpiresOn: Date.today().add(3).days().toString(dateFormat)
    };
  },

  canPutOnReview: function () {
    return this.props.enrollment.on_review_count < this.props.enrollment.on_review_maximum
        && this.props.inMatchingParticipantGroup.participants.length <= (this.props.enrollment.on_review_maximum - this.props.enrollment.on_review_count);
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });

    Intercom('trackEvent', 'clicked-employer-participants-review', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.participantNames()
    });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });

    Intercom('trackEvent', 'canceled-employer-participants-review', {
      employer_id: this.props.employer.id,
      employer_name: this.props.employer.name,
      participant_names: this.participantNames()
    });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    InMatchingParticipantGroupActions.offer(
      this.props.inMatchingParticipantGroup,
      this.props.employer,
      this.props.enrollment,
      this.state.onReviewExpiresOn,
      function (data) {
        this.setState({status: data.responseJSON.status});

        Intercom('trackEvent', 'confirmed-employer-participants-review', {
          employer_id: this.props.employer.id,
          employer_name: this.props.employer.name,
          participant_names: this.participantNames()
        });
      }.bind(this)
    );
  },

  participantNames: function () {
    return this.props.inMatchingParticipantGroup.participants.mapAttribute("name").join(", ");
  },

  render: function() {
    var action,
        legalese,
        footerName = this.props.inMatchingParticipantGroup.name,
        participantPluralized = this.props.inMatchingParticipantGroup.participants.length > 1 ? 'participants' : 'participant';

    if (this.state.status) {
      var status = this.state.status;
      return Alert({type: status.type, message: status.message, instructions: status.instructions, action: new AlertAction(status.action.title, status.action.url)})
    } else {
      if (this.state.puttingOnReview) {
        action = (
          React.DOM.div({className: "btn-group pull-right"},
            React.DOM.button({className: "btn btn-success", onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, "Confirm"),
            React.DOM.button({className: "btn btn-default", onClick: this.handleCancel}, "Cancel")
          )
        )
        legalese = (
          React.DOM.div(null,
            React.DOM.p({className: "panel-text"}, "You will have until ", React.DOM.strong(null, this.state.onReviewExpiresOn), " to offer a position or decline the ", participantPluralized, "."),
            React.DOM.p({className: "panel-text"}, "If you take no action by ", React.DOM.strong(null, this.state.onReviewExpiresOn), ", the ", participantPluralized, " will automatically be removed from your On Review list.")
          )
        )
      } else if (this.canPutOnReview()) {
        action = React.DOM.button({className: "btn btn-success pull-right", onClick: this.handlePutOnReview}, "Put on Review");
      } else {
        action = React.DOM.span({className: "label label-warning"}, "On Review limit reached");
      }

      return (
        React.DOM.div({className: "panel panel-default participant-group-panel", 'data-participant-names': this.participantNames()},
          React.DOM.div({className: "list-group"},
            this.props.inMatchingParticipantGroup.participants.map(function (participant) {
              return ParticipantGroupParticipant({key: participant.id, data: participant});
            })
          ),
          ParticipantGroupPanelFooter({name: footerName},
            action,
            legalese
          )
        )
      )
    }
  }
});
