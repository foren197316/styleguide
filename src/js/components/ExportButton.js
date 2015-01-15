var HiddenIdInput = React.createClass({displayName: 'HiddenIdInput',
  propTypes: {
    id: React.PropTypes.number.isRequired
  },

  render: function () {
    return React.DOM.input({type: 'hidden', name: 'ids[]', value: this.props.id})
  }
});

var ExportButton = React.createClass({displayName: 'ExportButton',
  propTypes: {
    ids: React.PropTypes.array.isRequired,
    url: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      React.DOM.form({action: this.props.url, method: 'GET'},
        React.DOM.button({className: 'btn btn-block btn-default', type: 'submit', style: { marginBottom: '15px'}},
          React.DOM.i({className: 'fa fa-download'}), ' Export to CSV'
        ),
        this.props.ids.map(function (id) {
          return HiddenIdInput({id: id, key: 'hidden_input_'+id})
        })
      )
    )
  }
});
