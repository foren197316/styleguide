var ReadOnlyFormGroup = React.createClass({displayName: 'ReadOnlyFormGroup',
  render: function () {
    var label = this.props.label,
        value = this.props.value;

    return (
      React.DOM.div({className: 'form-group'},
        React.DOM.label({className: 'control-label col-xs-12 col-sm-4'}, label),
        React.DOM.span({className: 'control-label col-xs-12 col-sm-8', style: { 'textAlign': 'left'}}, value)
      )
    );
  }
});
