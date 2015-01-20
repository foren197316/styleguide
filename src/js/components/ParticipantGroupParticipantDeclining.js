'use strict';

var ParticipantGroupParticipant = require('./ParticipantGroupParticipant');

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

var ParticipantGroupParticipantDeclining = React.createClass({displayName: 'ParticipantGroupParticipantDeclining',
  render: function () {
    return (
      ParticipantGroupParticipant({participant: this.props.data},
        ParticipantGroupParticipantDecliningForm({data: this.props.data})
      )
    );
  }
});

module.exports = ParticipantGroupParticipantDeclining;
