var validateMoney = function (value) {
  if (value) {
    if (!/^\d+([\.,]\d{1,2})?$/.test(value)) {
      return "error";
    }
  }
};

var validateNumber = function (value) {
  if (value) {
    if (!/^\d+(\.\d+)?$/.test(value)) {
     return "error";
    }
  }
};

var draftJobOfferFormName = function (key, field) {
  return "draft_job_offers[" + key + "][" + field + "]";
};

var draftJobOfferFormId = function (key, field) {
  return "draft_job_offers_" + key + "_" + field;
};

var LinkToParticipantName = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    href: React.PropTypes.string
  },

  render: function () {
    return this.props.href
      ? <span><a href={this.props.href}>{this.props.name}</a></span>
      : <span>{this.props.name}</span>;
  }
});

var ParticipantGroupItemWrapper = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired
  },

  render: function () {
    var participant = this.props.participant,
        hr = React.Children.count(this.props.children) > 0 ? <hr /> : null;

    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={participant.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={participant.photo_url + "/convert?h=100&w=100&fit=crop"} alt={participant.name} />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">
                  <LinkToParticipantName name={participant.name} href={participant.href} />
                </h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-lg-6">
                <label>{participant.country_name}</label>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-lg-8">
                <strong><YearCalculator from={participant.date_of_birth} to={participant.arrival_date} /></strong>
                &nbsp;
                &nbsp;
                <strong>{participant.gender}</strong>
              </div>
              <div className="col-xs-hidden col-lg-4 text-right">
                <dl className="dl-horizontal">
                  <dt>Availability</dt>
                  <dd>
                    <span>{Date.parse(participant.arrival_date).add(2).days().toString(dateFormat)}</span>
                    <br/>
                    <span>{Date.parse(participant.departure_date).toString(dateFormat)}</span>
                  </dd>
                </dl>
              </div>
            </div>
            {hr}
            {React.Children.map(this.props.children, function (child) {
              return (
                <div className="row">
                  <div className="col-xs-12">
                    {child}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
});

var ParticipantGroupParticipant = React.createClass({
  render: function () {
    return (
      <ParticipantGroupItemWrapper participant={this.props.data} />
    )
  }
});


var ParticipantGroupParticipantOfferingFormTipped = React.createClass({
  mixins: [ValidatingInputMixin],

  validate: function () {
    return true;
  },

  render: function () {
    var key = this.props.resourceId;

    return (
      <div className="form-group">
        <label className="col-xs-12 col-sm-4 control-label" htmlFor={draftJobOfferFormName(key, "tipped")}>Tipped?</label>
        <div className="col-xs-12 col-sm-8">
          <RadioGroup name={draftJobOfferFormName(key, "tipped")} id={draftJobOfferFormId(key, "tipped")} className="btn-group btn-group-justified" onChange={this.handleChange}>
            <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={draftJobOfferFormId(key, "tipped") + "_yes"} htmlFor={draftJobOfferFormId(key, "tipped") + "_yes"} />
            <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={draftJobOfferFormId(key, "tipped") + "_no"} htmlFor={draftJobOfferFormId(key, "tipped") + "_no"} />
          </RadioGroup>
        </div>
      </div>
    )
  }
});

var ParticipantGroupParticipantOfferingFormHours = React.createClass({
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
    return value !== null && value.length > 0 && validateNumber(value) !== "error";
  },

  render: function () {
    var key = this.props.resourceId;

    return (
      <ReactBootstrap.Input name={draftJobOfferFormName(key, "hours")} id={draftJobOfferFormId(key, "hours")} value={this.state.value}  label="Hours per week" hasFeedback bsStyle={validateNumber(this.state.value)} labelClassName="col-sm-4" type="text" step="1" wrapperClassName="col-sm-8" onChange={this.handleChange} />
    )
  }
});

var ParticipantGroupParticipantOfferingFormOvertime = React.createClass({
  statics: { validates: true},

  getInitialState: function () {
    return {overtime: null};
  },

  handleChange: function (event) {
    var overtime = event.target.value;
    this.setState({overtime: overtime});
    this.props.validationState.requestChange(overtime === "no" || overtime === "maybe");
  },

  validate: function () {
    return this.state.overtime !== null && this.state.overtime.length > 0;
  },

  render: function () {
    var key = this.props.resourceId,
        overtimeRate = this.state.overtime === "yes"
          ? React.Children.map(this.props.children, function (child) {
              return React.addons.cloneWithProps(child, {
                validationState: this.props.validationState,
                resourceId: this.props.resourceId
              });
            }.bind(this))
          : null;

    return (
      <div>
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor={draftJobOfferFormId(key, "overtime")}>Overtime?</label>
          <div className="col-sm-8">
            <RadioGroup name={draftJobOfferFormName(key, "overtime")} id={draftJobOfferFormId(key, "overtime")} value={this.state.overtime} className="btn-group btn-group-justified" onChange={this.handleChange}>
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={draftJobOfferFormId(key, "overtime") + "_yes"} htmlFor={draftJobOfferFormId(key, "overtime") + "_yes"} />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={draftJobOfferFormId(key, "overtime") + "_no"} htmlFor={draftJobOfferFormId(key, "overtime") + "_no"} />
              <RadioGroupButton title="Maybe" inputValue="maybe" iconClass="fa fa-question text-danger" id={draftJobOfferFormId(key, "overtime") + "_maybe"} htmlFor={draftJobOfferFormId(key, "overtime") + "_maybe"} />
            </RadioGroup>
          </div>
        </div>
        {overtimeRate}
      </div>
    )
  }
});

var ParticipantGroupParticipantOfferingFormOvertimeRate = React.createClass({
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return  value !== null && value.length > 0 && validateMoney(value) !== 'error';
  },

  render: function () {
    var participantKey = this.props.resourceId;

    return (
      <ReactBootstrap.Input name={draftJobOfferFormName(participantKey, "overtime_rate")} id={draftJobOfferFormId(participantKey, "overtime_rate")} value={this.state.value} hasFeedback bsStyle={validateMoney(this.state.value)} onChange={this.handleChange} label="Overtime rate per hour" addonBefore="$" type="text" labelClassName="col-sm-4" wrapperClassName="col-sm-8" />
    )
  }
});

var ParticipantGroupParticipantOfferingFormPosition = React.createClass({
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return value !== null && value.length > 0;
  },

  render: function () {
    return (
      <ReactBootstrap.Input
        name={draftJobOfferFormName(this.props.resourceId, "position_id")}
        id={draftJobOfferFormId(this.props.resourceId, "position_id")}
        defaultValue={this.state.position_id}
        label="Position"
        help="You can offer a participant any position they are interested in."
        onChange={this.handleChange}
        type="select"
        labelClassName="col-sm-4"
        wrapperClassName="col-sm-8"
      >
        <option disabled="disabled"></option>
        {this.props.positions.map(function(position) {
          return <option value={position.id} key={"offering_form_position_"+this.props.resourceId+"_"+position.id}>{position.name}</option>;
        }.bind(this))}
      </ReactBootstrap.Input>
    )
  }
});

var ParticipantGroupParticipantOfferingFormWage = React.createClass({
  mixins: [ValidatingInputMixin],

  validate: function (value) {
    return  value !== null && value.length > 0 && validateMoney(value) !== 'error';
  },

  render: function () {
    return (
      <ReactBootstrap.Input name={draftJobOfferFormName(this.props.resourceId, "wage")} id={draftJobOfferFormId(this.props.resourceId, "wage")} defaultValue={this.state.value} hasFeedback bsStyle={validateMoney(this.state.value)} onChange={this.handleChange} label="Wage per hour" labelClassName="col-sm-4" addonBefore="$" type="text" wrapperClassName="col-sm-8" />
    )
  }
});

var ParticipantGroupParticipantDecliningForm = React.createClass({
  getInitialState: function () {
    return {
      reason: "Unselected",
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
    var visibility = this.state.isOtherReason ? "show" : "hidden";

    return (
      <div>
        <div className="form-group">
          <label className="col-xs-12 col-sm-4 control-label">Reason</label>
          <RadioGroup className="col-xs-12 col-sm-8" defaultValue={this.state.reason} onChange={this.handleChange} name={"rejections[" + this.props.data.id + "][option]"}>
            <div className="radio"><label><input type="radio" value="Filled this position" /> Filled this position</label></div>
            <div className="radio"><label><input type="radio" value="Unsuitable work dates" /> Unsuitable work dates</label></div>
            <div className="radio"><label><input type="radio" value="Unsuitable English" /> Unsuitable English</label></div>
            <div className="radio"><label><input type="radio" value="" /> Other</label></div>
          </RadioGroup>
        </div>
        <ReactBootstrap.Input name={"rejections["+this.props.data.id+"][reason]"} id={"rejection_reason_"+this.props.data.id} label="Please specify" labelClassName={"col-sm-4 " + visibility} type="text" wrapperClassName={"col-sm-8 " + visibility}/>
      </div>
    )
  }
});

var ParticipantGroupParticipantOffering = React.createClass({
  render: function() {
    return (
      <ParticipantGroupItemWrapper participant={this.props.data}>
        <ValidatingFormGroup validationState={this.props.validationState} resourceId={this.props.data.id}>
          <ReactBootstrap.Input name={draftJobOfferFormName(this.props.data.id, "participant_id")} id={draftJobOfferFormId(this.props.data.id, "participant_id")} defaultValue={this.props.data.id} type="hidden" />
          <ParticipantGroupParticipantOfferingFormPosition positions={this.props.data.positions} />
          <ParticipantGroupParticipantOfferingFormWage />
          <ParticipantGroupParticipantOfferingFormTipped />
          <ParticipantGroupParticipantOfferingFormHours />
          <ParticipantGroupParticipantOfferingFormOvertime>
            <ParticipantGroupParticipantOfferingFormOvertimeRate />
          </ParticipantGroupParticipantOfferingFormOvertime>
        </ValidatingFormGroup>
      </ParticipantGroupItemWrapper>
    )
  }
});

var ParticipantGroupParticipantDeclining = React.createClass({
  render: function () {
    return (
      <ParticipantGroupItemWrapper participant={this.props.data}>
        <ParticipantGroupParticipantDecliningForm data={this.props.data} />
      </ParticipantGroupItemWrapper>
    )
  }
});
