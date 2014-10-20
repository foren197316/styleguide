var validateMoney = function (value) {
  if (value) {
    if (!/^\d+([\.,]\d{1,2})?$/.test(value)) {
      return "error";
    }
    else {
      return "success";
    }
  }
};

var getJobOfferFormName = function (key, field) {
  return "offered_participant_groups[draft_job_offers][" + key + "][" + field + "]";
};

var ParticipantGroupParticipant = React.createClass({
  render: function() {
    var listItemClass = this.props.data.gender == 'Female' ? 'list-group-item list-group-item-female' : 'list-group-item list-group-item-male';

    return (
      <div className={listItemClass}>
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
      <ReactBootstrap.Input name={getJobOfferFormName(this.props.key, "wage_per_hour")} value={this.state.wagePerHour} hasFeedback bsStyle={validateMoney(this.state.wagePerHour)} onChange={this.handleChange} label="Wage per hour" labelClassName="col-sm-4" addonBefore="$" type="text" wrapperClassName="col-sm-8" help="Must be a monetary value." />
    )
  }
});

var ParticipantGroupParticipantOfferingForm = React.createClass({

  getInitialState: function() {
    return {
      ref_names: {
        overtime_wage_per_hour: getJobOfferFormName(this.props.key, "overtime_wage_per_hour"),
        position_id: getJobOfferFormName(this.props.key, "position_id"),
        tipped_position: getJobOfferFormName(this.props.key, "tipped_position"),
        average_hours_per_week: getJobOfferFormName(this.props.key, "average_hours_per_week"),
        overtime_available: getJobOfferFormName(this.props.key, "overtime_available")
      }
    };
  },

  handleChange: function(event) {
    var state = this.state;
    state[event.target.getAttribute("name")] = event.target.value;
    this.setState(state);
  },

  validateNumber: function(name) {
    if (this.state[name]) {
      if (!/^\d+(\.\d+)?$/.test(this.state[name])) {
        return "error";
      }
      else {
        return "success";
      }
    }
  },

  validateMoney: function(name) {
    if (this.state[name]) {
      if (!/^\d+([\.,]\d{1,2})?$/.test(this.state[name])) {
        return "error";
      }
      else {
        return "success";
      }
    }
  },

  render: function() {
    var refs = this.state.ref_names,
        overtimeRate = this.state[refs["overtime_available"]] === 'yes'
          ? <ReactBootstrap.Input name={refs["overtime_wage_per_hour"]} value={this.state[refs["overtime_wage_per_hour"]]} hasFeedback bsStyle={validateMoney(this.state[refs["overtime_wage_per_hour"]])} onChange={this.handleChange} label="Overtime rate per hour" addonBefore="$" type="text" labelClassName="col-sm-4" wrapperClassName="col-sm-8" help="Must be a monetary value." />
          : null;

    return (
      <div>
        <ReactBootstrap.Input name={refs["position_id"]} defaultValue={this.state[refs["position_id"]]} label="Job Title" type="select" labelClassName="col-sm-4" wrapperClassName="col-sm-8">
          <option value="" disabled="disabled">Job Title</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </ReactBootstrap.Input>
        <ParticipantGroupParticipantOfferingFormWagePerHour key={this.props.key} />
        <div className="form-group">
          <label className="col-xs-12 col-sm-4 control-label" htmlFor={refs["tipped_position"]}>Tipped Position</label>
          <div className="col-sm-8">
            <RadioGroup name={refs["tipped_position"]} value={this.state[refs["tipped_position"]]} className="btn-group btn-group-justified">
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" />
            </RadioGroup>
          </div>
        </div>
        <ReactBootstrap.Input name={refs["average_hours_per_week"]} value={this.state[refs["average_hours_per_week"]]}  label="Average hours per week" hasFeedback bsStyle={this.validateNumber(refs["average_hours_per_week"])} help="Must be numeric." labelClassName="col-sm-4" type="text" step="1" wrapperClassName="col-sm-8" onChange={this.handleChange} />
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor={refs["overtime_available"]}>Are overtime hours available?</label>
          <div className="col-sm-8">
            <RadioGroup name={refs["overtime_available"]} value={this.state[refs["overtime_available"]]} className="btn-group btn-group-justified" onChange={this.handleChange}>
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" />
              <RadioGroupButton title="Maybe" inputValue="maybe" iconClass="fa fa-question text-danger" />
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
    var listItemClass = this.props.data.gender == 'Female' ? 'list-group-item list-group-item-female' : 'list-group-item list-group-item-male';

    return (
      <div className={listItemClass}>
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
