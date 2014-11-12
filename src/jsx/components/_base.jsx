/** @jsx React.DOM */

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
    this.props.onReviewExpiresOn = Date.today().add(3).days().toString('yyyy-MM-dd');
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
    var actionRow,
        participantPluralized = this.props.data.participants.length > 1 ? 'participants' : 'participant';
        participantNodes = this.props.data.participants.map(function (participant) {
        return (
          <ParticipantGroupParticipant key={participant.id} data={participant} />
        )
      });

    if (this.state.puttingOnReview) {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <div className="btn-group pull-right clearfix">
            <button className="btn btn-success" onClick={this.handleConfirm} disabled={this.state.sending ? 'disabled' : ''}>Confirm</button>
            <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
          </div>
        </div>
        <div className="col-xs-12 text-right">
          <hr />
          <p className="panel-text">You will have until <strong>{this.props.onReviewExpiresOn}</strong> to offer a position or decline the {participantPluralized}.</p>
          <p className="panel-text">If you take no action by <strong>{this.props.onReviewExpiresOn}</strong>, the {participantPluralized} will automatically be removed from your On Review list.</p>
        </div>
      </div>
    } else {
      actionRow = <div className="row">
        <div className="col-xs-3 col-sm-3">
          <div className="panel-title pull-left">{this.props.data.name}</div>
        </div>
        <div className="col-xs-9 col-sm-9">
          <button className="btn btn-success pull-right" onClick={this.handlePutOnReview}>Put on Review</button>
        </div>
      </div>
    }

    return (
      <div className="panel panel-default participant-group-panel">
        <div className="list-group">
          {participantNodes}
        </div>
        <div className="panel-footer clearfix">
          {actionRow}
        </div>
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

var ReadOnlyFormGroup = React.createClass({
  render: function () {
    var label = this.props.label,
        value = this.props.value

    return (
      <div className="form-group">
        <label className="control-label col-sm-4">{label}</label>
        <span className="control-label col-sm-8" style={{"text-align": "left", "text-transform": "capitalize"}}>{value}</span>
      </div>
    )
  }
});

