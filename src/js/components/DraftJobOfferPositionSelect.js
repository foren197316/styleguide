/* @flow */
'use strict';
var React = require('react/addons');
var RB = require('react-bootstrap');
var ValidatingInputMixin = require('../mixins').ValidatingInputMixin;

module.exports = React.createClass({displayName: 'DraftJobOfferPositionSelect',
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return value !== null && value.length > 0;
  },

  render: function () {
    return React.createElement(
      RB.Input,
      {
        id: this.props.id,
        name: this.props.name,
        defaultValue: this.props.position_id,
        label: 'Position',
        help: 'You can offer a participant any position they are interested in.',
        onChange: this.props.handleChange,
        type: 'select',
        labelClassName: 'col-sm-4',
        wrapperClassName: 'col-sm-8'
      },
      React.DOM.option({disabled: 'disabled'}),
      this.props.positions.map(function(position) {
        return React.DOM.option({value: position.id, key: 'offering_form_position_'+this.props.resourceId+'_'+position.id}, position.name);
      }, this)
    );
  }
});
