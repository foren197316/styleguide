'use strict';

var React = require('react/addons');
var getCsrfToken = require('../csrf-token');
var RD = React.DOM;

var HiddenIdInput = React.createClass({displayName: 'HiddenIdInput',
  propTypes: {
    id: React.PropTypes.number.isRequired
  },

  render: function () {
    return RD.input({type: 'hidden', name: 'ids[]', value: this.props.id});
  }
});

module.exports = React.createClass({displayName: 'ExportButton',
  propTypes: {
    ids: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      RD.form({action: this.props.url, method: 'POST'},
        RD.input({type: 'hidden', name: 'authenticity_token', value: getCsrfToken()}),
        RD.button({className: 'btn btn-block btn-default', type: 'submit', style: { marginBottom: '15px'}},
          RD.i({className: 'fa fa-download'}), ' Export to CSV'
        ),
        this.props.ids.map(function (id) {
          return React.createElement(HiddenIdInput, {id: id, key: 'hidden_input_'+id});
        })
      )
    );
  }
});
