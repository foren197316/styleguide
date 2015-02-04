'use strict';

var React = require('react/addons');

var RadioGroupButton = React.createClass({displayName: 'RadioGroupButton',
  handleChange: function(event) {
    var $buttonGroup = event.target.parentNode.parentNode,
        $buttons = $buttonGroup.querySelectorAll('.btn'),
        $radios = $buttonGroup.querySelectorAll('input[type="radio"]');

    for (var i=0; i < $buttons.length; i++) {
      var $button = $buttons[i],
          $radio = $radios[i];

      $button.className = $button.className.replace('active', '');

      if ($radio.checked) {
        $button.className = $button.className + ' active';
      }
    }
  },

  render: function() {
    return (
      React.DOM.label({className: 'btn btn-default btn-sm', htmlFor: this.props.htmlFor},
        React.DOM.input({type: 'radio', id: this.props.id, value: this.props.inputValue, onChange: this.handleChange}),
        React.DOM.i({className: this.props.iconClass}),
        this.props.title
      )
    );
  }
});

module.exports = RadioGroupButton;
