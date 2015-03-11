/* @flow */
'use strict';
var React = require('react/addons');
var RB = require('react-bootstrap');
var ValidatingInputMixin = require('../mixins').ValidatingInputMixin;
var ValidateNumber = require('../mixins').ValidateNumber;

module.exports = React.createClass({displayName: 'DraftJobOfferHoursInput',
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return value !== null   &&
           value.length > 0 &&
           ValidateNumber(value) !== 'error';
  },

  render: function () {
    return React.createElement(
      RB.Input, {
        id: this.props.id,
        name: this.props.name,
        value: this.state.value,
        onChange: this.handleChange,
        bsStyle: ValidateNumber(this.state.value),
        label: 'Hours per week',
        hasFeedback: true,
        type: 'text',
        labelClassName: 'col-sm-4',
        wrapperClassName: 'col-sm-8'
      }
    );
  }
});
