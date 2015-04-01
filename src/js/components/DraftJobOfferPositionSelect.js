/* @flow */
'use strict';
let React = require('react/addons');
let Input = React.createFactory(require('react-bootstrap').Input);
let { ValidatingInputMixin } = require('../mixins');
let { option } = React.DOM;

let DraftJobOfferPositionSelect = React.createClass({
  displayName: 'DraftJobOfferPositionSelect',
  mixins: [ValidatingInputMixin],

  validate (value) {
    return value != null && value.length > 0;
  },

  render () {
    return (
      Input({
          id: this.props.id,
          name: this.props.name,
          defaultValue: this.props.position_id,
          onChange: this.handleChange,
          label: 'Position',
          help: 'You can offer a participant any position they are interested in.',
          type: 'select',
          labelClassName: 'col-sm-4',
          wrapperClassName: 'col-sm-8'
        },
        option({disabled: 'disabled'}),
        this.props.positions.map((position, key) => (
          option({value: position.id, key}, position.name)
        ))
      )
    );
  }
});

module.exports = DraftJobOfferPositionSelect;
