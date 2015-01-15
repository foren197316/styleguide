var ReviewableParticipantGroupPanel = React.createClass({displayName: 'ReviewableParticipantGroupPanel',
  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString(dateFormat);
  },

  handlePutOnReview: function() {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function() {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function() {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            employer_id: this.props.employerId,
            expires_on: this.props.onReviewExpiresOn
          }
        };

    data.on_review_participant_group[this.props.idType] = this.props.data.id;

    $.ajax({
      url: '/on_review_participant_groups.json',
      type: 'POST',
      data: data,
      success: function() {
        React.unmountComponentAtNode(node);
        $(node).remove();
      },
      error: function() {
        window.location = window.location;
      }
    });
  },

  render: function() {
    var actions,
        additionalContent,
        footerName = this.props.data.name,
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant',
        participantNodes = this.props.data.participants.map(function (participant) {
          return ParticipantGroupParticipant({key: participant.id, data: participant});
        });

    if (this.state.puttingOnReview) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-success', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );

      additionalContent = (
        React.DOM.div(null,
          React.DOM.p({className: 'panel-text'}, 'You will have until ', React.DOM.strong(null, this.props.onReviewExpiresOn), ' to offer a position or decline the ', participantPluralized, '.'),
          React.DOM.p({className: 'panel-text'}, 'If you take no action by ', React.DOM.strong(null, this.props.onReviewExpiresOn), ', the ', participantPluralized, ' will automatically be removed from your On Review list.')
        )
      );
    } else {
      actions = (
        React.DOM.button({className: 'btn btn-success', onClick: this.handlePutOnReview}, 'Put on Review')
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        React.DOM.div({className: 'list-group'},
          participantNodes
        ),
        ParticipantGroupPanelFooter({name: footerName},
          actions,
          additionalContent
        )
      )
    );
  }
});
