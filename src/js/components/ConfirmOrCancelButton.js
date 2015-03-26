'use strict';
let React = require('react/addons');
let { div, button } = React.DOM;

let ConfirmOrCancelButton = React.createClass({
  displayName: 'ConfirmOrCancelButton',

  propTypes: {
    confirmFunction: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      confirming: false,
      disabled: false
    };
  },

  cancel () {
    this.setState({ confirming: false });
  },

  handleAction () {
    this.setState({ confirming: true });
  },

  handleConfirmation () {
    this.setState({ disabled: true });
    this.props.confirmFunction();
  },

  render () {
    if (this.state.confirming) {
      let disabled = this.state.disabled ? 'disabled' : '';

      return (
        div({className: 'btn-group'},
          button({className: 'btn btn-success', onClick: this.handleConfirmation, disabled}, 'Confirm'),
          button({className: 'btn btn-danger', onClick: this.cancel, disabled}, 'Cancel')
        )
      );
    } else {
      return (
        div({className: 'btn-group'},
          button({type: 'button', className: 'btn btn-success', onClick: this.handleAction}, this.props.children)
        )
      );
    }
  }
});

module.exports = ConfirmOrCancelButton;
