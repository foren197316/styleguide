var validateMoney = function (value) {
  if (value) {
    if (!/^\d+([\.,]\d{1,2})?$/.test(value)) {
      return 'error';
    }
  }
};

var validateNumber = function (value) {
  if (value) {
    if (!/^\d+(\.\d+)?$/.test(value)) {
     return 'error';
    }
  }
};

var draftJobOfferFormName = function (key, field) {
  return 'draft_job_offers[' + key + '][' + field + ']';
};

var draftJobOfferFormId = function (key, field) {
  return 'draft_job_offers_' + key + '_' + field;
};

var LinkToIf = React.createClass({displayName: 'LinkToIf',
  propTypes: {
    name: React.PropTypes.string.isRequired,
    href: React.PropTypes.string
  },

  render: function () {
    return this.props.href ?
      React.DOM.span(null, React.DOM.a({href: this.props.href}, this.props.name)) :
      React.DOM.span(null, this.props.name);
  }
});

var ParticipantGroupItemWrapper = React.createClass({displayName: 'ParticipantGroupItemWrapper',
  propTypes: {
    participant: React.PropTypes.object.isRequired
  },

  render: function () {
    var participant = this.props.participant,
        hr = React.Children.count(this.props.children) > 0 ? React.DOM.hr(null) : null;

    return (
      React.DOM.div({className: 'list-group-item list-group-item-participant', 'data-participant-name': participant.name},
        React.DOM.div({className: 'media'},
          React.DOM.img({className: 'media-object img-circle img-thumbnail pull-left', src: participant.photo_url + '/convert?h=100&w=100&fit=crop', alt: participant.name}),
          React.DOM.div({className: 'media-body'},
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12'},
                React.DOM.h4({className: 'media-heading'},
                  LinkToIf({name: participant.name, href: participant.href})
                )
              )
            ),
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12 col-md-6'},
                React.DOM.strong(null, participant.country_name),
                React.DOM.br(null),
                React.DOM.strong(null, YearCalculator({from: participant.date_of_birth, to: participant.arrival_date})),
                React.DOM.strong({style: { 'paddingLeft': '5px'}}, participant.gender)
              )
            ),
            React.DOM.hr(null),
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12 col-md-4 col-md-offset-4'},
                React.DOM.div({className: 'row text-right'},
                  React.DOM.div({className: 'col-xs-6 col-md-10'},
                    React.DOM.strong(null, 'English ', React.DOM.span({className: 'hidden-xs'}, 'Level'), ' ')
                  ),
                  React.DOM.div({className: 'col-xs-6 col-md-2'},
                    React.DOM.span(null, participant.english_level)
                  )
                )
              ),
              React.DOM.div({className: 'col-xs-12 col-md-4'},
                React.DOM.div({className: 'row text-right'},
                  React.DOM.div({className: 'col-xs-6 col-md-5 col-lg-7'},
                    React.DOM.strong(null, 'Availability')
                  ),
                  React.DOM.div({className: 'col-xs-6 col-md-7 col-lg-5'},
                    React.DOM.span(null, Date.parse(participant.arrival_date).add(2).days().toString(dateFormat)),
                    React.DOM.br(null),
                    React.DOM.span(null, Date.parse(participant.departure_date).toString(dateFormat))
                  )
                )
              )
            ),
            hr,
            React.Children.map(this.props.children, function (child) {
              return (
                React.DOM.div({className: 'row'},
                  React.DOM.div({className: 'col-xs-12'},
                    child
                  )
                )
              );
            })
          )
        )
      )
    );
  }
});

var ParticipantGroupParticipant = React.createClass({displayName: 'ParticipantGroupParticipant',
  render: function () {
    return (
      ParticipantGroupItemWrapper({participant: this.props.data})
    );
  }
});


var ParticipantGroupParticipantOfferingFormTipped = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormTipped',
  mixins: [ValidatingInputMixin],

  validate: function () {
    return true;
  },

  render: function () {
    var key = this.props.resourceId;

    return (
      React.DOM.div({className: 'form-group'},
        React.DOM.label({className: 'col-xs-12 col-sm-4 control-label', htmlFor: draftJobOfferFormName(key, 'tipped')}, 'Tipped?'),
        React.DOM.div({className: 'col-xs-12 col-sm-8'},
          RadioGroup({name: draftJobOfferFormName(key, 'tipped'), id: draftJobOfferFormId(key, 'tipped'), className: 'btn-group btn-group-justified', onChange: this.handleChange},
            RadioGroupButton({title: 'Yes', inputValue: 'true', iconClass: 'fa fa-check text-success', id: draftJobOfferFormId(key, 'tipped') + '_yes', htmlFor: draftJobOfferFormId(key, 'tipped') + '_yes'}),
            RadioGroupButton({title: 'No', inputValue: 'false', iconClass: 'fa fa-close text-danger', id: draftJobOfferFormId(key, 'tipped') + '_no', htmlFor: draftJobOfferFormId(key, 'tipped') + '_no'})
          )
        )
      )
    );
  }
});

var ParticipantGroupParticipantOfferingFormHours = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormHours',
  statics: { validates: true},

  getInitialState: function() {
    return {hours: null};
  },

  handleChange: function (event) {
    var newState = this.validate(event.target.value);
    this.setState({hours: event.target.value});
    this.props.validationState.requestChange(newState);
  },

  validate: function (value) {
    return value !== null && value.length > 0 && validateNumber(value) !== 'error';
  },

  render: function () {
    var key = this.props.resourceId;

    return (
      ReactBootstrap.Input({name: draftJobOfferFormName(key, 'hours'), id: draftJobOfferFormId(key, 'hours'), value: this.state.value, label: 'Hours per week', hasFeedback: true, bsStyle: validateNumber(this.state.value), labelClassName: 'col-sm-4', type: 'text', step: '1', wrapperClassName: 'col-sm-8', onChange: this.handleChange})
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
      React.DOM.div(null,
        React.DOM.div({className: 'form-group'},
          React.DOM.label({className: 'col-sm-4 control-label', htmlFor: draftJobOfferFormId(key, 'overtime')}, 'Overtime?'),
          React.DOM.div({className: 'col-sm-8'},
            RadioGroup({name: draftJobOfferFormName(key, 'overtime'), id: draftJobOfferFormId(key, 'overtime'), value: this.state.overtime, className: 'btn-group btn-group-justified', onChange: this.handleChange},
              RadioGroupButton({title: 'Yes', inputValue: 'yes', iconClass: 'fa fa-check text-success', id: draftJobOfferFormId(key, 'overtime') + '_yes', htmlFor: draftJobOfferFormId(key, 'overtime') + '_yes'}),
              RadioGroupButton({title: 'No', inputValue: 'no', iconClass: 'fa fa-close text-danger', id: draftJobOfferFormId(key, 'overtime') + '_no', htmlFor: draftJobOfferFormId(key, 'overtime') + '_no'}),
              RadioGroupButton({title: 'Maybe', inputValue: 'maybe', iconClass: 'fa fa-question text-danger', id: draftJobOfferFormId(key, 'overtime') + '_maybe', htmlFor: draftJobOfferFormId(key, 'overtime') + '_maybe'})
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
    return  value !== null && value.length > 0 && validateMoney(value) !== 'error';
  },

  render: function () {
    var participantKey = this.props.resourceId;

    return (
      ReactBootstrap.Input({name: draftJobOfferFormName(participantKey, 'overtime_rate'), id: draftJobOfferFormId(participantKey, 'overtime_rate'), value: this.state.value, hasFeedback: true, bsStyle: validateMoney(this.state.value), onChange: this.handleChange, label: 'Overtime rate per hour', addonBefore: '$', type: 'text', labelClassName: 'col-sm-4', wrapperClassName: 'col-sm-8'})
    );
  }
});

var ParticipantGroupParticipantOfferingFormPosition = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormPosition',
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return value !== null && value.length > 0;
  },

  render: function () {
    return (
      ReactBootstrap.Input({
        name: draftJobOfferFormName(this.props.resourceId, 'position_id'),
        id: draftJobOfferFormId(this.props.resourceId, 'position_id'),
        defaultValue: this.state.position_id,
        label: 'Position',
        help: 'You can offer a participant any position they are interested in.',
        onChange: this.handleChange,
        type: 'select',
        labelClassName: 'col-sm-4',
        wrapperClassName: 'col-sm-8'
      },
        React.DOM.option({disabled: 'disabled'}),
        this.props.positions.map(function(position) {
          return React.DOM.option({value: position.id, key: 'offering_form_position_'+this.props.resourceId+'_'+position.id}, position.name);
        }.bind(this))
      )
    );
  }
});

var ParticipantGroupParticipantOfferingFormWage = React.createClass({displayName: 'ParticipantGroupParticipantOfferingFormWage',
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return  value !== null && value.length > 0 && validateMoney(value) !== 'error';
  },

  render: function () {
    return (
      ReactBootstrap.Input({name: draftJobOfferFormName(this.props.resourceId, 'wage'), id: draftJobOfferFormId(this.props.resourceId, 'wage'), defaultValue: this.state.value, hasFeedback: true, bsStyle: validateMoney(this.state.value), onChange: this.handleChange, label: 'Wage per hour', labelClassName: 'col-sm-4', addonBefore: '$', type: 'text', wrapperClassName: 'col-sm-8'})
    );
  }
});

var ParticipantGroupParticipantDecliningForm = React.createClass({displayName: 'ParticipantGroupParticipantDecliningForm',
  getInitialState: function () {
    return {
      reason: 'Unselected',
      isOtherReason: false
    };
  },

  handleChange: function (event) {
    this.setState({
      reason: event.target.value,
      isOtherReason: event.target.value.length === 0
    });
  },

  componentDidUpdate: function () {
    if (this.state.isOtherReason) {
      $(this.getDOMNode()).find('input[type="text"]').focus();
    }

    $(this.getDOMNode()).find('input[type="text"]').val(this.state.reason);
  },

  render: function () {
    var visibility = this.state.isOtherReason ? 'show' : 'hidden';

    return (
      React.DOM.div(null,
        React.DOM.div({className: 'form-group'},
          React.DOM.label({className: 'col-xs-12 col-sm-4 control-label'}, 'Reason'),
          RadioGroup({className: 'col-xs-12 col-sm-8', defaultValue: this.state.reason, onChange: this.handleChange, name: 'rejections[' + this.props.data.id + '][option]'},
            React.DOM.div({className: 'radio'}, React.DOM.label(null, React.DOM.input({type: 'radio', value: 'Filled this position'}), ' Filled this position')),
            React.DOM.div({className: 'radio'}, React.DOM.label(null, React.DOM.input({type: 'radio', value: 'Unsuitable work dates'}), ' Unsuitable work dates')),
            React.DOM.div({className: 'radio'}, React.DOM.label(null, React.DOM.input({type: 'radio', value: 'Unsuitable English'}), ' Unsuitable English')),
            React.DOM.div({className: 'radio'}, React.DOM.label(null, React.DOM.input({type: 'radio', value: ''}), ' Other'))
          )
        ),
        ReactBootstrap.Input({name: 'rejections['+this.props.data.id+'][reason]', id: 'rejection_reason_'+this.props.data.id, label: 'Please specify', labelClassName: 'col-sm-4 ' + visibility, type: 'text', wrapperClassName: 'col-sm-8 ' + visibility})
      )
    );
  }
});

var ParticipantGroupParticipantOffering = React.createClass({displayName: 'ParticipantGroupParticipantOffering',
  render: function() {
    return (
      ParticipantGroupItemWrapper({participant: this.props.data},
        ValidatingFormGroup({validationState: this.props.validationState, resourceId: this.props.data.id},
          ReactBootstrap.Input({name: draftJobOfferFormName(this.props.data.id, 'participant_id'), id: draftJobOfferFormId(this.props.data.id, 'participant_id'), defaultValue: this.props.data.id, type: 'hidden'}),
          ParticipantGroupParticipantOfferingFormPosition({positions: this.props.data.positions}),
          ParticipantGroupParticipantOfferingFormWage(null),
          ParticipantGroupParticipantOfferingFormTipped(null),
          ParticipantGroupParticipantOfferingFormHours(null),
          ParticipantGroupParticipantOfferingFormOvertime(null,
            ParticipantGroupParticipantOfferingFormOvertimeRate(null)
          )
        )
      )
    );
  }
});

var ParticipantGroupParticipantDeclining = React.createClass({displayName: 'ParticipantGroupParticipantDeclining',
  render: function () {
    return (
      ParticipantGroupItemWrapper({participant: this.props.data},
        ParticipantGroupParticipantDecliningForm({data: this.props.data})
      )
    );
  }
});
