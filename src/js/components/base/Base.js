var dateFormat = "MM/dd/yyyy";

String.prototype.capitaliseWord = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.camelCaseToUnderscore = function () {
  return this.replace(/([A-Z])/g, "_$1").toLowerCase();
};

Array.prototype.flatten = function () {
  return this.reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);
};

Array.prototype.diff = function(array) {
  return this.filter(function(i) {return array.indexOf(i) < 0;});
};

Array.prototype.findById = function (id, alternateKey) {
  var key = alternateKey || "id";

  try {
    if (id instanceof Array) {
      return this.filter(function (entry) {
        return id.indexOf(entry[key]) >= 0;
      });
    } else {
      for (var i in this) {
        if (this[i][key] === id) {
          return this[i];
        }
      }
      return null;
    }
  } catch (e) {
    console.log(e.stack);
  }
};

Array.prototype.intersects = function (array) {
  if (array.length > 0 && this.length > 0) {
    for (var i in this) {
      if (array.indexOf(this[i]) >= 0) {
        return true;
      }
    }
  }

  return false;
};

Array.prototype.intersection = function (a) {
  return this.filter(function (entry) {
    return a.indexOf(entry) >= 0;
  });
}

Array.prototype.mapAttribute = function (attribute) {
  try {
    return this.map(function (entry) {
      return entry[attribute];
    });
  } catch (e) {
    console.log(e.stack)
  }
};

Array.prototype.notEmpty = function () {
  return this.filter(function (entry) {
    return entry != undefined;
  });
};

String.prototype.pluralize = function (count) {
  if (count === 1) {
    return this;
  } else {
    return this + "s";
  }
};

Array.prototype.uniq = function () {
  return this.reduce(function (prev, curr) {
    if (prev.indexOf(curr) < 0) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

var Spinner = React.createClass({displayName: 'Spinner',
  render: function() {
    return (
      React.DOM.i({className: "fa fa-spinner fa-spin"})
    )
  }
});

var YearCalculator = React.createClass({displayName: 'YearCalculator',
  componentDidMount: function() {
    $(this.getDOMNode()).tooltip();
  },

  render: function() {
    return (
      React.DOM.span(null, calculateAgeAtArrival(this.props.to, this.props.from))
    )
  }
});

var calculateAgeAtArrival = function (to, from) {
  return new TimePeriod(Date.parse(to), Date.parse(from)).years;
};

var RadioGroupButton = React.createClass({displayName: 'RadioGroupButton',
  handleChange: function(event) {
    var $buttonGroup = event.target.parentNode.parentNode,
        $buttons = $buttonGroup.querySelectorAll('.btn'),
        $radios = $buttonGroup.querySelectorAll('input[type="radio"]');

    for (var i=0; i < $buttons.length; i++) {
      var $button = $buttons[i],
          $radio = $radios[i];

      $button.className = $button.className.replace("active", "");

      if ($radio.checked) {
        $button.className = $button.className + " active";
      }
    }
  },

  render: function() {
    return (
      React.DOM.label({className: "btn btn-default btn-sm", htmlFor: this.props.htmlFor},
        React.DOM.input({type: "radio", id: this.props.id, value: this.props.inputValue, onChange: this.handleChange}),
        React.DOM.i({className: this.props.iconClass}),
        this.props.title
      )
    )
  }
});

var ReviewableParticipantGroupPanel = React.createClass({displayName: 'ReviewableParticipantGroupPanel',
  getInitialState: function() {
    return { sending: false, puttingOnReview: false };
  },

  componentWillMount: function() {
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString(dateFormat);
  },

  handlePutOnReview: function(event) {
    this.setState({ puttingOnReview: true });
  },

  handleCancel: function(event) {
    this.setState({ puttingOnReview: false });
  },

  handleConfirm: function(event) {
    this.setState({ sending: true });

    var node = this.getDOMNode(),
        data = {
          on_review_participant_group: {
            employer_id: this.props.employerId,
            expires_on: this.props.onReviewExpiresOn
          }
        };

    data.on_review_participant_group[this.props.idType] = this.props.data.id;

    $.ajax({
      url: "/on_review_participant_groups.json",
      type: "POST",
      data: data,
      success: function(data) {
        React.unmountComponentAtNode(node);
        $(node).remove();
      },
      error: function(data) {
        window.location = window.location;
      }
    });
  },

  render: function() {
    var actions,
        additionalContent,
        footerName = this.props.data.name,
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant';
        participantNodes = this.props.data.participants.map(function (participant) {
          return (
            ParticipantGroupParticipant({key: participant.id, data: participant})
          )
        });

    if (this.state.puttingOnReview) {
      actions = (
        React.DOM.div({className: "btn-group"},
          React.DOM.button({className: "btn btn-success", onClick: this.handleConfirm, disabled: this.state.sending ? 'disabled' : ''}, "Confirm"),
          React.DOM.button({className: "btn btn-default", onClick: this.handleCancel}, "Cancel")
        )
      );

      additionalContent = (
        React.DOM.div(null,
          React.DOM.p({className: "panel-text"}, "You will have until ", React.DOM.strong(null, this.props.onReviewExpiresOn), " to offer a position or decline the ", participantPluralized, "."),
          React.DOM.p({className: "panel-text"}, "If you take no action by ", React.DOM.strong(null, this.props.onReviewExpiresOn), ", the ", participantPluralized, " will automatically be removed from your On Review list.")
        )
      )
    } else {
      actions = (
        React.DOM.button({className: "btn btn-success", onClick: this.handlePutOnReview}, "Put on Review")
      )
    }

    return (
      React.DOM.div({className: "panel panel-default participant-group-panel"},
        React.DOM.div({className: "list-group"},
          participantNodes
        ),
        ParticipantGroupPanelFooter({name: footerName},
          actions,
          additionalContent
        )
      )
    )
  }
});

var ParticipantGroupPanelFooterName = React.createClass({displayName: 'ParticipantGroupPanelFooterName',
  propTypes: { name: React.PropTypes.string.isRequired },

  render: function () {
    return (
      React.DOM.div({className: "row"},
        React.DOM.div({className: "col-xs-6 col-sm-6"},
          React.DOM.div({className: "panel-title pull-left", style: { "whiteSpace": "nowrap"}},
            this.props.name
          )
        ),
        React.DOM.div({className: "col-xs-6 col-sm-6"},
          React.DOM.div({className: "pull-right"},
            this.props.children
          )
        )
      )
    )
  }
});

var ParticipantGroupPanelFooter = React.createClass({displayName: 'ParticipantGroupPanelFooter',
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  render: function () {
    var name = this.props.name,
        children = React.Children.map(this.props.children, function (child, index) {
          if (child == undefined) return;

          if (index === 0) {
            return ParticipantGroupPanelFooterName({name: name}, child)
          } else {
            return (
              React.DOM.div({className: "row"},
                React.DOM.div({className: "col-xs-12 text-right"},
                  React.DOM.hr(null),
                  child
                )
              )
            );
          }
        }) || ParticipantGroupPanelFooterName({name: name});

    return (
      React.DOM.div({className: "panel-footer clearfix"},
        children
      )
    )
  }
});

var ReadOnlyFormGroup = React.createClass({displayName: 'ReadOnlyFormGroup',
  render: function () {
    var label = this.props.label,
        value = this.props.value;

    return (
      React.DOM.div({className: "form-group"},
        React.DOM.label({className: "control-label col-xs-12 col-sm-4"}, label),
        React.DOM.span({className: "control-label col-xs-12 col-sm-8", style: { "textAlign": "left"}}, value)
      )
    )
  }
});

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
    )
  }
});

/** Mixins **/
var GroupPanelsMixin = {
  getInitialState: function () {
    return {
      groups: null
    };
  },

  getIdType: function () {
    return this.resourceName.replace(/s$/, '_id');
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          groups: data[this.resourceName]
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var employerId = this.props.employerId,
          employerName = this.props.employerName,
          participantGroupPanelType = this.participantGroupPanelType,
          idType = this.getIdType(),
          groupPanels = this.state.groups.map(function (group) {
            return (
              participantGroupPanelType({key: group.id, data: group, employerId: employerId, employerName: employerName, idType: idType})
            );
          });

      return (
        React.DOM.div({id: "participant-group-panels"},
          groupPanels
        )
      );
    } else {
      return Spinner(null)
    };
  }
};

var ValidatingInputMixin = {
  statics: { validates: true },

  propTypes: { validationState: React.PropTypes.object.isRequired },

  getInitialState: function() {
    return {value: null};
  },

  handleChange: function (event) {
    var newState = this.validate(event.target.value);
    this.setState({value: event.target.value});
    this.props.validationState.requestChange(newState);
  }
};

var RenderLoadedMixin = function () {
  var args = arguments;

  if (args.length === 0) {
    throw new Error("RenderLoadedMixin takes at least one string argument.");
  }

  return {
    render: function () {
      for (var i=0; i<args.length; i++) {
        if (!this.state[args[i]]) {
          return Spinner(null);
        }
      }
      return this.renderLoaded();
    }
  }
};
