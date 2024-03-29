'use strict';

var React = require('react/addons');
var ReactBootstrap = require('react-bootstrap');
var RadioGroup = require('react-radio-group');
var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');
var DraftJobOfferPositionSelect = require('./DraftJobOfferPositionSelect');
var DraftJobOfferWageInput = require('./DraftJobOfferWageInput');
var DraftJobOfferHoursInput = require('./DraftJobOfferHoursInput');
var RadioGroupButton = require('./RadioGroupButton');
var ValidatingFormGroup = require('./ValidatingFormGroup');
var ValidatingInputMixin = require('../mixins').ValidatingInputMixin;
var ValidateMoney = require('../mixins').ValidateMoney;

var draftJobOfferFormName = function (key, field) {
  return 'draft_job_offers[' + key + '][' + field + ']';
};

var draftJobOfferFormId = function (key, field) {
  return 'draft_job_offers_' + key + '_' + field;
};

var ParticipantGroupParticipantOfferingFormTipped = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormTipped',
  mixins: [ValidatingInputMixin],

  validate: function () {
    return true;
  },

  render: function () {
    var key = this.props.resourceId;

    return (
      React.DOM.div({className: 'form-group'},
        React.DOM.label({className: 'col-xs-12 col-sm-4 control-label', htmlFor: this.props.name}, 'Tipped?'),
        React.DOM.div({className: 'col-xs-12 col-sm-8'},
          React.createElement(RadioGroup, {name: this.props.name, id: this.props.id, className: 'btn-group btn-group-justified', onChange: this.handleChange},
            React.createElement(RadioGroupButton, {title: 'Yes', inputValue: 'true', iconClass: 'fa fa-check text-success', id: draftJobOfferFormId(key, 'tipped') + '_yes', htmlFor: draftJobOfferFormId(key, 'tipped') + '_yes'}),
            React.createElement(RadioGroupButton, {title: 'No', inputValue: 'false', iconClass: 'fa fa-close text-danger', id: draftJobOfferFormId(key, 'tipped') + '_no', htmlFor: draftJobOfferFormId(key, 'tipped') + '_no'})
          )
        )
      )
    );
  }
});

var ParticipantGroupParticipantOfferingFormOvertime = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormOvertime',
  statics: { validates: true},

  getInitialState: function () {
    return {overtime: null};
  },

  handleChange: function (event) {
    var overtime = event.target.value;
    this.setState({overtime: overtime});
    this.props.validationState.requestChange(overtime === 'no' || overtime === 'maybe');
  },

  validate: function () {
    return this.state.overtime !== null && this.state.overtime.length > 0;
  },

  render: function () {
    var key = this.props.resourceId,
        overtimeRate = this.state.overtime === 'yes' ?
          React.Children.map(this.props.children, function (child) {
            return React.addons.cloneWithProps(child, {
              validationState: this.props.validationState,
              resourceId: this.props.resourceId
            });
          }.bind(this)) :
          null;

    return (
      React.DOM.div({},
        React.DOM.div({className: 'form-group'},
          React.DOM.label({className: 'col-sm-4 control-label', htmlFor: draftJobOfferFormId(key, 'overtime')}, 'Overtime?'),
          React.DOM.div({className: 'col-sm-8'},
            React.createElement(RadioGroup, {name: this.props.name, id: this.props.id, value: this.state.overtime, className: 'btn-group btn-group-justified', onChange: this.handleChange},
              React.createElement(RadioGroupButton, {title: 'Yes', inputValue: 'yes', iconClass: 'fa fa-check text-success', id: draftJobOfferFormId(key, 'overtime') + '_yes', htmlFor: draftJobOfferFormId(key, 'overtime') + '_yes'}),
              React.createElement(RadioGroupButton, {title: 'No', inputValue: 'no', iconClass: 'fa fa-close text-danger', id: draftJobOfferFormId(key, 'overtime') + '_no', htmlFor: draftJobOfferFormId(key, 'overtime') + '_no'}),
              React.createElement(RadioGroupButton, {title: 'Maybe', inputValue: 'maybe', iconClass: 'fa fa-question text-danger', id: draftJobOfferFormId(key, 'overtime') + '_maybe', htmlFor: draftJobOfferFormId(key, 'overtime') + '_maybe'})
            )
          )
        ),
        overtimeRate
      )
    );
  }
});

var ParticipantGroupParticipantOfferingFormOvertimeRate = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormOvertimeRate',
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return  value !== null && value.length > 0 && ValidateMoney(value) !== 'error';
  },

  render: function () {
    return React.createElement(
      ReactBootstrap.Input, {name: this.props.name, id: this.props.id, value: this.state.value, hasFeedback: true, bsStyle: ValidateMoney(this.state.value), onChange: this.handleChange, label: 'Overtime rate per hour', addonBefore: '$', type: 'text', labelClassName: 'col-sm-4', wrapperClassName: 'col-sm-8'}
    );
  }
});

var ParticipantGroupParticipantOffering = React.createClass({
  displayName: 'ParticipantGroupParticipantOffering',

  propTypes: {
    positions: React.PropTypes.array.isRequired,
  },

  render: function() {
    let { positions } = this.props;
    return (
      React.createElement(ParticipantGroupParticipant, {participant: this.props.data},
        React.createElement(ValidatingFormGroup, {validationState: this.props.validationState, resourceId: this.props.data.id},
          React.createElement(ReactBootstrap.Input, {name: draftJobOfferFormName(this.props.data.id, 'participant_id'), id: draftJobOfferFormId(this.props.data.id, 'participant_id'), defaultValue: this.props.data.id, type: 'hidden'}),
          React.createElement(DraftJobOfferPositionSelect, {name: draftJobOfferFormName(this.props.data.id, 'position_id'), id: draftJobOfferFormId(this.props.data.id, 'position_id'), positions}),
          React.createElement(DraftJobOfferWageInput, {name: draftJobOfferFormName(this.props.data.id, 'wage'), id: draftJobOfferFormId(this.props.data.id, 'wage')}),
          React.createElement(ParticipantGroupParticipantOfferingFormTipped, {name: draftJobOfferFormName(this.props.data.id, 'tipped'), id: draftJobOfferFormId(this.props.data.id, 'tipped')}),
          React.createElement(DraftJobOfferHoursInput, {name: draftJobOfferFormName(this.props.data.id, 'hours'), id: draftJobOfferFormId(this.props.data.id, 'hours')}),
          React.createElement(ParticipantGroupParticipantOfferingFormOvertime, {name: draftJobOfferFormName(this.props.data.id, 'overtime'), id: draftJobOfferFormId(this.props.data.id, 'overtime')},
            React.createElement(ParticipantGroupParticipantOfferingFormOvertimeRate, {name: draftJobOfferFormName(this.props.data.id, 'overtime_rate'), id: draftJobOfferFormId(this.props.data.id, 'overtime_rate')})
          )
        )
      )
    );
  }
});

module.exports = ParticipantGroupParticipantOffering;
