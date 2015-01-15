var dateFormat = 'MM/dd/yyyy';

String.prototype.capitaliseWord = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.camelCaseToUnderscore = function () {
  return this.replace(/([A-Z])/g, '_$1').toLowerCase();
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
  var key = alternateKey || 'id';

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
};

Array.prototype.mapAttribute = function (attribute) {
  try {
    return this.map(function (entry) {
      return entry[attribute];
    });
  } catch (e) {
    console.log(e.stack);
  }
};

Array.prototype.notEmpty = function () {
  return this.filter(function (entry) {
    return entry !== undefined && entry !== null;
  });
};

String.prototype.pluralize = function (count) {
  if (count === 1) {
    return this;
  } else {
    return this + 's';
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
        React.DOM.div({id: 'participant-group-panels'},
          groupPanels
        )
      );
    } else {
      return Spinner(null);
    }
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
    throw new Error('RenderLoadedMixin takes at least one string argument.');
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
  };
};
