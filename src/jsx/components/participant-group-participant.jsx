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

var ParticipantGroupParticipantOfferingFormWagePerHour = React.createClass({
  getInitialState: function() {
    return {wagePerHour: null};
  },

  handleChange: function (event) {
    this.setState({wagePerHour: event.target.value});
  },

  render: function () {
    return (
      <ReactBootstrap.Input name={confirmDraftJobOfferFormName(this.props.key, "wage_per_hour")} id={confirmDraftJobOfferFormId(this.props.key, "wage_per_hour")} value={this.state.wagePerHour} hasFeedback bsStyle={validateMoney(this.state.wagePerHour)} onChange={this.handleChange} label="Wage per hour" labelClassName="col-sm-4" addonBefore="$" type="text" wrapperClassName="col-sm-8" />
    )
  }
});

var ParticipantGroupParticipantOfferingForm = React.createClass({

  getInitialState: function() {
    return {
      ref_names: {
        participant_id: confirmDraftJobOfferFormName(this.props.key, "participant_id"),
        position_id: confirmDraftJobOfferFormName(this.props.key, "position_id"),
        overtime_wage_per_hour: confirmDraftJobOfferFormName(this.props.key, "overtime_wage_per_hour"),
        tipped_position: confirmDraftJobOfferFormName(this.props.key, "tipped_position"),
        average_hours_per_week: confirmDraftJobOfferFormName(this.props.key, "average_hours_per_week"),
        overtime_available: confirmDraftJobOfferFormName(this.props.key, "overtime_available")
      },
      ref_ids: {
        participant_id: confirmDraftJobOfferFormId(this.props.key, "participant_id"),
        position_id: confirmDraftJobOfferFormId(this.props.key, "position_id"),
        overtime_wage_per_hour: confirmDraftJobOfferFormId(this.props.key, "overtime_wage_per_hour"),
        tipped_position: confirmDraftJobOfferFormId(this.props.key, "tipped_position"),
        average_hours_per_week: confirmDraftJobOfferFormId(this.props.key, "average_hours_per_week"),
        overtime_available: confirmDraftJobOfferFormId(this.props.key, "overtime_available")
      }
    };
  },

  handleChange: function(event) {
    var state = this.state;
    state[event.target.getAttribute("name")] = event.target.value;
    this.setState(state);
  },

  render: function() {
    var ref_names = this.state.ref_names,
        ref_ids = this.state.ref_ids,
        overtimeRate = this.state[ref_names["overtime_available"]] === 'yes'
          ? <ReactBootstrap.Input name={ref_names["overtime_wage_per_hour"]} id={ref_ids["overtime_wage_per_hour"]} value={this.state[ref_names["overtime_wage_per_hour"]]} hasFeedback bsStyle={validateMoney(this.state[ref_names["overtime_wage_per_hour"]])} onChange={this.handleChange} label="Overtime rate per hour" addonBefore="$" type="text" labelClassName="col-sm-4" wrapperClassName="col-sm-8" />
          : null;

    return (
      <div>
        <ReactBootstrap.Input name={ref_names["participant_id"]} id={ref_ids["participant_id"]} defaultValue={this.props.key} type="hidden" />
        <ReactBootstrap.Input name={ref_names["position_id"]} id={ref_ids["position_id"]} defaultValue={this.state[ref_names["position_id"]]} label="Position" type="select" labelClassName="col-sm-4" wrapperClassName="col-sm-8">
          <option></option>
          <option value="1">Attractions Attendant</option>
          <option value="2">Barista</option>
          <option value="3">Bartender</option>
        </ReactBootstrap.Input>
        <ParticipantGroupParticipantOfferingFormWagePerHour key={this.props.key} />
        <div className="form-group">
          <label className="col-xs-12 col-sm-4 control-label" htmlFor={ref_names["tipped_position"]}>Tipped Position</label>
          <div className="col-sm-8">
            <RadioGroup name={ref_names["tipped_position"]} id={ref_ids["tipped_position"]} value={this.state[ref_names["tipped_position"]]} className="btn-group btn-group-justified">
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={ref_ids["tipped_position"] + "_yes"} htmlFor={ref_ids["tipped_position"] + "_yes"} />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={ref_ids["tipped_position"] + "_no"} htmlFor={ref_ids["tipped_position"] + "_no"} />
            </RadioGroup>
          </div>
        </div>
        <ReactBootstrap.Input name={ref_names["average_hours_per_week"]} id={ref_ids["average_hours_per_week"]} value={this.state[ref_names["average_hours_per_week"]]}  label="Average hours per week" hasFeedback bsStyle={validateNumber(this.state[ref_names["average_hours_per_week"]])} labelClassName="col-sm-4" type="text" step="1" wrapperClassName="col-sm-8" onChange={this.handleChange} />
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor={ref_ids["overtime_available"]}>Are overtime hours available?</label>
          <div className="col-sm-8">
            <RadioGroup name={ref_names["overtime_available"]} id={ref_ids["overtime_available"]} value={this.state[ref_names["overtime_available"]]} className="btn-group btn-group-justified" onChange={this.handleChange}>
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={ref_ids["overtime_available"] + "_yes"} htmlFor={ref_ids["overtime_available"] + "_yes"} />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={ref_ids["overtime_available"] + "_no"} htmlFor={ref_ids["overtime_available"] + "_no"} />
              <RadioGroupButton title="Maybe" inputValue="maybe" iconClass="fa fa-question text-danger" id={ref_ids["overtime_available"] + "_maybe"} htmlFor={ref_ids["overtime_available"] + "_maybe"} />
            </RadioGroup>
          </div>
        </div>
        {overtimeRate}
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
                <ParticipantGroupParticipantOfferingForm key={this.props.key} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
