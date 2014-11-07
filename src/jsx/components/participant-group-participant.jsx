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

var ParticipantGroupParticipant = React.createClass({
  render: function() {
    var participantName = this.props.data.href
      ? <a href={this.props.data.href}>{this.props.data.name}</a>
      : <span>{this.props.data.name}</span>;

    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={this.props.data.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.data.photo_url} alt="{this.props.data.name}" />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">{participantName}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-3 col-lg-6">
                <i className="fa fa-globe"></i>
                <label>{this.props.data.country_name}</label>
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <label>{this.props.data.gender.substring(0, 1).toUpperCase()}</label>
                <YearCalculator from={this.props.data.date_of_birth} to={this.props.data.arrival_date} />
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <i className="fa fa-plane fa-flip-vertical"></i>
                <span>{this.props.data.arrival_date}</span>
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <i className="fa fa-plane"></i>
                <span>{this.props.data.departure_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});


var ParticipantGroupParticipantOfferingFormTipped = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },

  handleChange: function (event) {
    if (! this.state.selected) {
      this.props.propagateFormValidity({"tipped": true});
    }

    this.setState({selected: true});
  },

  render: function () {
    var key = this.props.participantKey;

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
  getInitialState: function() {
    return {hours: null};
  },

  handleChange: function (event) {
    var oldState = this.validate(this.state.hours),
        newState = this.validate(event.target.value);

    this.setState({hours: event.target.value});

    if (oldState !== newState) {
      this.props.propagateFormValidity({"hours": newState});
    }
  },

  validate: function (value) {
    return value !== null && value.length > 0 && validateNumber(value) !== "error";
  },

  render: function () {
    var key = this.props.participantKey;

    return (
      <ReactBootstrap.Input name={draftJobOfferFormName(key, "hours")} id={draftJobOfferFormId(key, "hours")} value={this.state.hours}  label="Hours per week" hasFeedback bsStyle={validateNumber(this.state.hours)} labelClassName="col-sm-4" type="text" step="1" wrapperClassName="col-sm-8" onChange={this.handleChange} />
    )
  }
});

var ParticipantGroupParticipantOfferingFormOvertime = React.createClass({
  getInitialState: function () {
    return {overtime: null};
  },

  handleChange: function (event) {
    this.setState({overtime: event.target.value});

    var overtimeRateValidity = event.target.value !== "yes";
    this.props.propagateFormValidity({"overtime": true, "overtime_rate": overtimeRateValidity});
  },

  validate: function () {
    return this.state.overtime !== null && this.state.overtime.length > 0;
  },

  render: function () {
    var key = this.props.participantKey,
        overtimeRate = this.state.overtime === "yes"
          ? <ParticipantGroupParticipantOfferingFormOvertimeRate participantKey={key} propagateFormValidity={this.props.propagateFormValidity} />
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
  getInitialState: function() {
    return {overtime_rate: null};
  },

  handleChange: function (event) {
    var oldState = this.validate(this.state.overtime_rate),
        newState = this.validate(event.target.value);

    this.setState({overtime_rate: event.target.value});

    if (oldState !== newState) {
      this.props.propagateFormValidity({"overtime_rate": newState});
    }
  },

  validate: function (value) {
    return  value !== null && value.length > 0 && validateMoney(value) !== 'error';
  },

  render: function () {
    var participantKey = this.props.participantKey;

    return (
      <ReactBootstrap.Input name={draftJobOfferFormName(participantKey, "overtime_rate")} id={draftJobOfferFormId(participantKey, "overtime_rate")} value={this.state.overtime_rate} hasFeedback bsStyle={validateMoney(this.state.overtime_rate)} onChange={this.handleChange} label="Overtime rate per hour" addonBefore="$" type="text" labelClassName="col-sm-4" wrapperClassName="col-sm-8" />
    )
  }
});

var ParticipantGroupParticipantOfferingFormPosition = React.createClass({
  getInitialState: function() {
    return {position_id: null};
  },

  handleChange: function (event) {
    var oldState = this.validate(this.state.position_id),
        newState = this.validate(event.target.value);

    this.setState({position_id: event.target.value});

    if (oldState !== newState) {
      this.props.propagateFormValidity({"position_id": true});
    }
  },

  validate: function (value) {
    return value !== null && value.length > 0;
  },

  render: function () {
    var positionOptions = this.props.positions.map(function(position) {
          return (
            <option value={position.id}>{position.name}</option>
          )
        });

    return (
      <ReactBootstrap.Input
        name={draftJobOfferFormName(this.props.participantKey, "position_id")}
        id={draftJobOfferFormId(this.props.participantKey, "position_id")}
        defaultValue={this.state.position_id}
        label="Position"
        help="You can offer a participant any position they are interested in."
        onChange={this.handleChange}
        type="select"
        labelClassName="col-sm-4"
        wrapperClassName="col-sm-8"
      >
        <option disabled="disabled"></option>
        {positionOptions}
      </ReactBootstrap.Input>
    )
  }
});

var ParticipantGroupParticipantOfferingFormWage = React.createClass({
  getInitialState: function() {
    return {wage: null};
  },

  handleChange: function (event) {
    var oldState = this.validate(this.state.wage),
        newState = this.validate(event.target.value);

    this.setState({wage: event.target.value});

    if (oldState !== newState) {
      this.props.propagateFormValidity({"wage": newState});
    }
  },

  validate: function (value) {
    return  value !== null && value.length > 0 && validateMoney(value) !== 'error';
  },

  render: function () {
    return (
      <ReactBootstrap.Input name={draftJobOfferFormName(this.props.participantKey, "wage")} id={draftJobOfferFormId(this.props.participantKey, "wage")} defaultValue={this.state.wage} hasFeedback bsStyle={validateMoney(this.state.wage)} onChange={this.handleChange} label="Wage per hour" labelClassName="col-sm-4" addonBefore="$" type="text" wrapperClassName="col-sm-8" />
    )
  }
});

var ParticipantGroupParticipantOfferingForm = React.createClass({
  getInitialState: function () {
    return {
      formValidity: {
        position_id: false,
        wage: false,
        tipped: false,
        hours: false,
        overtime: false,
        overtime_rate: true
      }
    };
  },

  formIsValid: function () {
    return this.state.formValidity.position_id
      && this.state.formValidity.wage
      && this.state.formValidity.tipped
      && this.state.formValidity.hours
      && this.state.formValidity.overtime
      && this.state.formValidity.overtime_rate;
  },

  propagateFormValidity: function (values) {
    var valid    = this.state.formValidity,
        oldState = this.formIsValid();

    for (prop in values) {
      valid[prop] = values[prop];
    }

    this.setState({formValidity: valid});

    if (oldState !== this.formIsValid()) {
      this.props.toggleNodeStatus();
    }
  },

  render: function () {
    return (
      <div>
        <ReactBootstrap.Input name={draftJobOfferFormName(this.props.key, "participant_id")} id={draftJobOfferFormId(this.props.key, "participant_id")} defaultValue={this.props.key} type="hidden" />
        <ParticipantGroupParticipantOfferingFormPosition participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} positions={this.props.data.positions} />
        <ParticipantGroupParticipantOfferingFormWage participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
        <ParticipantGroupParticipantOfferingFormTipped participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
        <ParticipantGroupParticipantOfferingFormHours participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
        <ParticipantGroupParticipantOfferingFormOvertime participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
      </div>
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
          <RadioGroup className="col-xs-12 col-sm-8" defaultValue={this.state.reason} onChange={this.handleChange} name={"rejections[" + this.props.key + "][option]"}>
            <div className="radio"><label><input type="radio" value="Filled this position" /> Filled this position</label></div>
            <div className="radio"><label><input type="radio" value="Unsuitable work dates" /> Unsuitable work dates</label></div>
            <div className="radio"><label><input type="radio" value="Unsuitable English" /> Unsuitable English</label></div>
            <div className="radio"><label><input type="radio" value="" /> Other</label></div>
          </RadioGroup>
        </div>
        <ReactBootstrap.Input name={"rejections["+this.props.key+"][reason]"} id={"rejection_reason_"+this.props.key} label="Please specify" labelClassName={"col-sm-4 " + visibility} type="text" wrapperClassName={"col-sm-8 " + visibility}/>
      </div>
    )
  }
});

var ParticipantGroupParticipantOffering = React.createClass({
  render: function() {
    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={this.props.data.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.data.photo_url} alt="{this.props.data.name}" />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">{this.props.data.name}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <ParticipantGroupParticipantOfferingForm key={this.props.key} toggleNodeStatus={this.props.toggleNodeStatus} data={this.props.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var ParticipantGroupParticipantDeclining = React.createClass({
  render: function () {
    return (
      <div className="list-group-item list-group-item-participant" data-participant-name={this.props.data.name}>
        <div className="media">
          <img className="media-object img-circle img-thumbnail pull-left" src={this.props.data.photo_url} alt="{this.props.data.name}" />
          <div className="media-body">
            <div className="row">
              <div className="col-xs-12">
                <h4 className="media-heading">{this.props.data.name}</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <ParticipantGroupParticipantDecliningForm key={this.props.key} data={this.props.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
