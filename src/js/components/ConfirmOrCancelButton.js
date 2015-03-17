'use strict';
let React = require('react/addons');
let { div, button } = React.DOM;

let ConfirmOrCancelButton = React.createClass({
  displayName: 'ConfirmOrCancelButton',

  propTypes: {
    confirmFunction: React.PropTypes.func.isRequired
  },

  getInitialState(){
    return {
      confirming: false
    };
  },

  cancel(){
    this.setState({ confirming: false });
  },

  handleAction(){
    this.setState({ confirming: true });
  },

  render() {
    if (this.state.confirming) {
      return (
        div({className: 'btn-group'},
          button({className: 'btn btn-success', onClick: this.props.confirmFunction}, 'Confirm'),
          button({className: 'btn btn-danger', onClick: this.cancel}, 'Cancel')
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
