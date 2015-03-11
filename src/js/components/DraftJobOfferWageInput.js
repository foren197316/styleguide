/* @flow */
'use strict';
var React = require('react/addons');
var RB = require('react-bootstrap');
var ValidatingInputMixin = require('../mixins').ValidatingInputMixin;
var ValidateMoney = require('../mixins').ValidateMoney;

module.exports = React.createClass({displayName: 'DraftJobOfferWageInput',
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return value !== null   &&
           value.length > 0 &&
           ValidateMoney(value) !== 'error';
  },

  render: function () {
    return React.createElement(
      RB.Input, {
        id: this.props.id,
        name: this.props.name,
        defaultValue: this.state.value,
        onChange: this.handleChange,
        bsStyle: ValidateMoney(this.state.value),
        label: 'Wage per hour',
        hasFeedback: true,
        type: 'text',
        labelClassName: 'col-sm-4',
        wrapperClassName: 'col-sm-8',
        addonBefore: '$'
      }
    );
  }
});
