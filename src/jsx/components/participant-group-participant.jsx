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

var confirmDraftJobOfferFormName = function (key, field) {
  return "confirm[draft_job_offers][" + key + "][" + field + "]";
};

var confirmDraftJobOfferFormId = function (key, field) {
  return "confirm_draft_job_offers_" + key + "_" + field;
};

var ParticipantGroupParticipant = React.createClass({
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
              <div className="col-xs-12 col-sm-3 col-lg-6">
                <i className="fa fa-globe"></i>
                <strong>{this.props.data.country_name}</strong>&nbsp;
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <GenderIcon gender={this.props.data.gender} />
                <TooltippedYearCalculator from={this.props.data.date_of_birth} to={this.props.data.arrival_date} tooltipTitle="Age at Arrival" />
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <TooltippedIconSpan iconClass="fa fa-plane fa-flip-vertical" spanContent={this.props.data.arrival_date} tooltipTitle="Arrival Date" />
              </div>
              <div className="col-xs-12 col-sm-3 col-lg-2 text-right">
                <TooltippedIconSpan iconClass="fa fa-plane" spanContent={this.props.data.departure_date} tooltipTitle="Departure Date" />
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
        <label className="col-xs-12 col-sm-4 control-label" htmlFor={confirmDraftJobOfferFormName(key, "tipped")}>Tipped Position</label>
        <div className="col-sm-8">
          <RadioGroup name={confirmDraftJobOfferFormName(key, "tipped")} id={confirmDraftJobOfferFormId(key, "tipped")} className="btn-group btn-group-justified" onChange={this.handleChange}>
            <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={confirmDraftJobOfferFormId(key, "tipped") + "_yes"} htmlFor={confirmDraftJobOfferFormId(key, "tipped") + "_yes"} />
            <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={confirmDraftJobOfferFormId(key, "tipped") + "_no"} htmlFor={confirmDraftJobOfferFormId(key, "tipped") + "_no"} />
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
      <ReactBootstrap.Input name={confirmDraftJobOfferFormName(key, "hours")} id={confirmDraftJobOfferFormId(key, "hours")} value={this.state.hours}  label="Average hours per week" hasFeedback bsStyle={validateNumber(this.state.hours)} labelClassName="col-sm-4" type="text" step="1" wrapperClassName="col-sm-8" onChange={this.handleChange} />
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
          <label className="col-sm-4 control-label" htmlFor={confirmDraftJobOfferFormId(key, "overtime")}>Are overtime hours available?</label>
          <div className="col-sm-8">
            <RadioGroup name={confirmDraftJobOfferFormName(key, "overtime")} id={confirmDraftJobOfferFormId(key, "overtime")} value={this.state.overtime} className="btn-group btn-group-justified" onChange={this.handleChange}>
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={confirmDraftJobOfferFormId(key, "overtime") + "_yes"} htmlFor={confirmDraftJobOfferFormId(key, "overtime") + "_yes"} />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={confirmDraftJobOfferFormId(key, "overtime") + "_no"} htmlFor={confirmDraftJobOfferFormId(key, "overtime") + "_no"} />
              <RadioGroupButton title="Maybe" inputValue="maybe" iconClass="fa fa-question text-danger" id={confirmDraftJobOfferFormId(key, "overtime") + "_maybe"} htmlFor={confirmDraftJobOfferFormId(key, "overtime") + "_maybe"} />
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
    var key = this.props.key;

    return (
      <ReactBootstrap.Input name={confirmDraftJobOfferFormName(key, "overtime_rate")} id={confirmDraftJobOfferFormId(key, "overtime_rate")} value={this.state.overtime_rate} hasFeedback bsStyle={validateMoney(this.state.overtime_rate)} onChange={this.handleChange} label="Overtime rate per hour" addonBefore="$" type="text" labelClassName="col-sm-4" wrapperClassName="col-sm-8" />
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
      <ReactBootstrap.Input name={confirmDraftJobOfferFormName(this.props.participantKey, "wage")} id={confirmDraftJobOfferFormId(this.props.participantKey, "wage")} defaultValue={this.state.wage} hasFeedback bsStyle={validateMoney(this.state.wage)} onChange={this.handleChange} label="Wage per hour" labelClassName="col-sm-4" addonBefore="$" type="text" wrapperClassName="col-sm-8" />
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
      <ReactBootstrap.Input name={confirmDraftJobOfferFormName(this.props.participantKey, "position_id")} id={confirmDraftJobOfferFormId(this.props.participantKey, "position_id")} defaultValue={this.state.position_id} label="Position" onChange={this.handleChange} type="select" labelClassName="col-sm-4" wrapperClassName="col-sm-8">
        <option disabled="disabled"></option>
        {positionOptions}
      </ReactBootstrap.Input>
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
    var valid = this.state.formValidity;

    for (prop in values) {
      valid[prop] = values[prop];
    }

    this.setState({formValidity: valid});

    if (this.props.draftJobOfferValid !== this.formIsValid()) {
      this.props.toggleDraftJobOfferValid();
    }
  },

  render: function () {
    return (
      <div>
        <ReactBootstrap.Input name={confirmDraftJobOfferFormName(this.props.key, "participant_id")} id={confirmDraftJobOfferFormId(this.props.key, "participant_id")} defaultValue={this.props.key} type="hidden" />
        <ParticipantGroupParticipantOfferingFormPosition participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} positions={this.props.data.positions} />
        <ParticipantGroupParticipantOfferingFormWage participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
        <ParticipantGroupParticipantOfferingFormTipped participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
        <ParticipantGroupParticipantOfferingFormHours participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
        <ParticipantGroupParticipantOfferingFormOvertime participantKey={this.props.key} propagateFormValidity={this.propagateFormValidity} />
      </div>
    )
  }
});

var ParticipantGroupParticipantOffering = React.createClass({
  render: function() {
    var draftJobOfferValid = this.props.draftJobOfferValid,
        toggleDraftJobOfferValid = this.props.toggleDraftJobOfferValid;

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
                <ParticipantGroupParticipantOfferingForm key={this.props.key} draftJobOfferValid={draftJobOfferValid} toggleDraftJobOfferValid={toggleDraftJobOfferValid} data={this.props.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
