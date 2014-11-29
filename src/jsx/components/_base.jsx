/** @jsx React.DOM */

var dateFormat = "MM/dd/yyyy";

Array.prototype.flatten = function () {
  return this.reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);
};

Array.prototype.mapAttribute = function (attribute) {
  return this.map(function (entry) {
    return entry[attribute];
  });
};

var capitaliseWord = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var camelCaseToUnderscore = function (string) {
  return string.replace(/([A-Z])/g, "_$1").toLowerCase();
}

var Spinner = React.createClass({
  render: function() {
    return (
      <i className="fa fa-spinner fa-spin"></i>
    )
  }
});

var YearCalculator = React.createClass({
  componentDidMount: function() {
    $(this.getDOMNode()).tooltip();
  },

  render: function() {
    var to = Date.today(this.props.to),
        from = Date.parse(this.props.from),
        period = new TimePeriod(to, from);

    return (
      <span>{period.years}</span>
    )
  }
});

var RadioGroupButton = React.createClass({
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
      <label className="btn btn-default btn-sm" htmlFor={this.props.htmlFor}>
        <input type="radio" id={this.props.id} value={this.props.inputValue} onChange={this.handleChange} />
        <i className={this.props.iconClass}></i>
        {this.props.title}
      </label>
    )
  }
});

var ReviewableParticipantGroupPanel = React.createClass({
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
        footerName = this.props.data.name + (this.props.data.program != undefined ? " - " + this.props.data.program.name : ""),
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant';
        participantNodes = this.props.data.participants.map(function (participant) {
          return (
            <ParticipantGroupParticipant key={participant.id} data={participant} />
          )
        });

    if (this.state.puttingOnReview) {
      actions = (
        <div className="btn-group">
          <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
          <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
        </div>
      );

      additionalContent = (
        <div>
          <p className="panel-text">You will have until <strong>{this.props.onReviewExpiresOn}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{this.props.onReviewExpiresOn}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      )
    } else {
      actions = (
        <button className="btn btn-success" onClick={this.handlePutOnReview}>Put on Review</button>
      )
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {participantNodes}
        </div>
        <ParticipantGroupPanelFooter name={footerName}>
          {actions}
          {additionalContent}
        </ParticipantGroupPanelFooter>
      </div>
    )
  }
});

var ParticipantGroupPanelFooterName = React.createClass({
  propTypes: { name: React.PropTypes.string.isRequired },

  render: function () {
    return (
      <div className="row">
        <div className="col-xs-6 col-sm-6">
          <div className="panel-title pull-left" style={{ "whiteSpace": "nowrap"}}>
            {this.props.name}
          </div>
        </div>
        <div className="col-xs-6 col-sm-6">
          <div className="pull-right">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
});

var ParticipantGroupPanelFooter = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  render: function () {
    var name = this.props.name,
        children = React.Children.map(this.props.children, function (child, index) {
          if (child == undefined) return;

          if (index === 0) {
            return <ParticipantGroupPanelFooterName name={name}>{child}</ParticipantGroupPanelFooterName>
          } else {
            return (
              <div className="row">
                <div className="col-xs-12 text-right">
                  <hr />
                  {child}
                </div>
              </div>
            );
          }
        }) || <ParticipantGroupPanelFooterName name={name} />;

    return (
      <div className="panel-footer clearfix">
        {children}
      </div>
    )
  }
});

var ReadOnlyFormGroup = React.createClass({
  render: function () {
    var label = this.props.label,
        value = this.props.value;

    return (
      <div className="form-group">
        <label className="control-label col-xs-12 col-sm-4">{label}</label>
        <span className="control-label col-xs-12 col-sm-8" style={{ "textAlign": "left" }}>{value}</span>
      </div>
    )
  }
});

var ValidatingFormGroup = React.createClass({
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
      <div>
        {React.Children.map(this.props.children, function (child, index) {
          var props = {
            validationState: this.linkState(this.stateName(index))
          };

          if (this.props.resourceId) {
            props.resourceId = this.props.resourceId;
          }

          return React.addons.cloneWithProps(child, props);
        }.bind(this))}
      </div>
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
          participantGroupPanelType = this.participantGroupPanelType,
          idType = this.getIdType(),
          groupPanels = this.state.groups.map(function (group) {
            return (
              <participantGroupPanelType key={group.id} data={group} employerId={employerId} idType={idType} />
            );
          });

      return (
        <div id="participant-group-panels">
          {groupPanels}
        </div>
      );
    } else {
      return <Spinner />
    };
  }
};

var ValidatingInputMixin = {
  statics: { validates: true},

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

var LoadResourceMixin = {
  loadResource: function (resourceName) {
    return function (params) {
      return Q($.ajax({
        url: this.props.urls[resourceName],
        type: "GET",
        data: params
      })).then(function (response) {
        if (this.isMounted()) {
          var state = {},
              data = response[camelCaseToUnderscore(resourceName)];

          state[resourceName] = data;
          this.setState(state);
          return data;
        }
      }.bind(this));
    }.bind(this);
  },

  extractIds: function (idsAttribute) {
    var prepareArray;

    if ('ids' === idsAttribute.substr(idsAttribute.length - 3)) {
      prepareArray = function (array) { return array.flatten(); }
    } else {
      prepareArray = function (array) { return array; }
    }

    return function (entries) {
      return {
        ids: prepareArray(entries.mapAttribute(idsAttribute)).sort()
      };
    }
  },

  loadAll: function (promiseList) {
    if (this.state.isLoaded) {
      this.setState({ isLoaded: false });
    }

    return Q.allSettled(promiseList)
    .then(function () {
      if (this.isMounted()) {
        this.setState({ isLoaded: true });
      }
    }.bind(this));
  },

  waitForLoadAll: function (loadedCallback) {
    return this.state.isLoaded
      ? loadedCallback()
      : <Spinner />;
  }
};
