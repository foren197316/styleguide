'use strict';

let React = require('react/addons');
let csrfToken = require('../csrf-token');
let { input, form, button, i } = React.DOM;

let HiddenIdInput = React.createClass({displayName: 'HiddenIdInput',
  propTypes: {
    id: React.PropTypes.number.isRequired
  },

  render: function () {
    return input({type: 'hidden', name: 'ids[]', value: this.props.id});
  }
});

module.exports = React.createClass({displayName: 'ExportButton',
  propTypes: {
    ids: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      form({action: this.props.url, method: 'POST'},
        input({type: 'hidden', name: 'authenticity_token', value: csrfToken}),
        button({className: 'btn btn-block btn-default', type: 'submit', style: { marginBottom: '15px'}},
          i({className: 'fa fa-download'}), ' Export to CSV'
        ),
        this.props.ids.map(function (id) {
          return React.createElement(HiddenIdInput, {id: id, key: 'hidden_input_'+id});
        })
      )
    );
  }
});
