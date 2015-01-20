'use strict';

var ValidatingFormGroup = React.createClass({displayName: 'ValidatingFormGroup',
  mixins: [React.addons.LinkedStateMixin],

  /**
   * TODO:
   * I'd like validate that validationState is a ReactLink,
   * but I'm not sure if React exposes the class.
   */
  propTypes: {
    validationState: React.PropTypes.object.isRequired,
    resourceId: React.PropTypes.number
  },

  stateName: function (index) {
    return 'childValid'+index.toString();
  },

  getInitialState: function () {
    var state = {};

    React.Children.forEach(this.props.children, function (child, index) {
      state[this.stateName(index)] = ! child.type.validates;
    }.bind(this));

    return state;
  },

  componentDidUpdate: function () {
    var valid = true;

    React.Children.forEach(this.props.children, function (child, index) {
      valid = valid && this.state[this.stateName(index)];
    }.bind(this));

    if (valid !== this.props.validationState.value) {
      this.props.validationState.requestChange(valid);
    }
  },

  render: function () {
    return (
      React.DOM.div(null,
        React.Children.map(this.props.children, function (child, index) {
          var props = {
            validationState: this.linkState(this.stateName(index))
          };

          if (this.props.resourceId) {
            props.resourceId = this.props.resourceId;
          }

          return React.addons.cloneWithProps(child, props);
        }.bind(this))
      )
    );
  }
});

module.exports = ValidatingFormGroup;
