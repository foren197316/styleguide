'use strict';

var EmployerStore = require('../stores/EmployerStore');
var JobOfferGroupActions = require('../actions').JobOfferGroupActions;
var EmployerHeader = require('./EmployerHeader');
var JobOffer = require('./JobOffer');
var ParticipantGroupPanelFooter = require('./ParticipantGroupPanelFooter');

var JobOfferGroup = React.createClass({displayName: 'JobOfferGroup',
  propTypes: {
    jobOfferGroup: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {};
  },

  handleReject: function () {
    this.setState({ rejecting: true });
  },

  handleCancel: function() {
    this.setState({ rejecting: false });
  },

  handleConfirm: function() {
    this.setState({ sending: true });
    JobOfferGroupActions.destroy(this.props.jobOfferGroup.id);
  },

  render: function () {
    var actions = null;
    var employer = EmployerStore.findById(this.props.jobOfferGroup.employer_id);

    if (this.state.rejecting) {
      actions = (
        React.DOM.div({className: 'btn-group'},
          React.DOM.button({className: 'btn btn-danger', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          React.DOM.button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (this.props.jobOfferGroup.can_reject) {
      actions = (
        React.DOM.button({className: 'btn btn-small btn-danger', onClick: this.handleReject}, 'Reject')
      );
    }

    return (
      React.DOM.div({className: 'panel panel-default participant-group-panel'},
        EmployerHeader({employer: employer}),
        React.DOM.div({className: 'list-group'},
          this.props.jobOfferGroup.job_offers.map(function (jobOffer) {
            return JobOffer({jobOffer: jobOffer, key: 'job_offer_'+jobOffer.id});
          })
        ),
        ParticipantGroupPanelFooter({name: this.props.jobOfferGroup.name},
          actions
        )
      )
    );
  }
});

module.exports = JobOfferGroup;
