/* @flow */
'use strict';
let React = require('react/addons');
let JobOfferGroupStore = require('../stores/JobOfferGroupStore');
let EmployerHeader = React.createFactory(require('./EmployerHeader'));
let JobOffer = React.createFactory(require('./JobOffer'));
let ParticipantGroupPanelFooter = React.createFactory(require('./ParticipantGroupPanelFooter'));
let moment = require('moment');
let { div, button, strong } = React.DOM;

let JobOfferGroup = React.createClass({
  displayName: 'JobOfferGroup',

  propTypes: {
    jobOfferGroup: React.PropTypes.object.isRequired,
    employer: React.PropTypes.object.isRequired,
    program: React.PropTypes.object.isRequired,
    positions: React.PropTypes.array.isRequired,
    staff: React.PropTypes.object
  },

  getInitialState () {
    return {};
  },

  handleReject () {
    this.setState({ rejecting: true });
  },

  handleCancel() {
    this.setState({ rejecting: false });
  },

  handleConfirm () {
    this.setState({ sending: true });
    JobOfferGroupStore.destroy(this.props.jobOfferGroup.id);
  },

  render () {
    let actions = null;
    let jobOfferGroup = this.props.jobOfferGroup;
    let employer = this.props.employer;
    let program = this.props.program;

    if (this.state.rejecting) {
      actions = (
        div({className: 'btn-group'},
          button({className: 'btn btn-danger', onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, 'Confirm'),
          button({className: 'btn btn-default', onClick: this.handleCancel}, 'Cancel')
        )
      );
    } else if (jobOfferGroup.can_reject) {
      actions = (
        button({className: 'btn btn-small btn-danger', onClick: this.handleReject}, 'Reject')
      );
    }

    return (
      div({className: 'panel panel-default participant-group-panel'},
        EmployerHeader({ employer }),
        div({className: 'list-group'},
          jobOfferGroup.job_offers.map(jobOffer => {
            let key = jobOffer.id;
            let position = this.props.positions.findById(jobOffer.position_id);
            return JobOffer({ jobOffer, position, key });
          })
        ),
        ParticipantGroupPanelFooter({name: jobOfferGroup.name},
          actions,
          div({ className: 'clearfix' },
            div({ className: 'pull-left' },
              strong({}, program.name)
            ),
            div({ className: 'pull-right' },
              moment(jobOfferGroup.created_at).fromNow()
            )
          )
        )
      )
    );
  }
});

module.exports = JobOfferGroup;
