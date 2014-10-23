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

var ParticipantGroupParticipantOfferingFormWage = React.createClass({
  getInitialState: function() {
    return {wage: null};
  },

  handleChange: function (event) {
    this.setState({wage: event.target.value});
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
    this.setState({position_id: event.target.value});
  },

  render: function () {
    var positionOptions = this.props.positions.map(function(position) {
          return (
            <option value={position.id}>{position.name}</option>
          )
        });

    return (
      <ReactBootstrap.Input name={confirmDraftJobOfferFormName(this.props.participantKey, "position_id")} id={confirmDraftJobOfferFormId(this.props.participantKey, "position_id")} defaultValue={this.state.position_id} label="Position" type="select" labelClassName="col-sm-4" wrapperClassName="col-sm-8">
        <option disabled="disabled"></option>
        {positionOptions}
      </ReactBootstrap.Input>
    )
  }
});

var ParticipantGroupParticipantOfferingForm = React.createClass({
  getInitialState: function() {
    return {
      ref_names: {
        participant_id: confirmDraftJobOfferFormName(this.props.key, "participant_id"),
        position_id: confirmDraftJobOfferFormName(this.props.key, "position_id"),
        tipped: confirmDraftJobOfferFormName(this.props.key, "tipped"),
        hours: confirmDraftJobOfferFormName(this.props.key, "hours"),
        overtime: confirmDraftJobOfferFormName(this.props.key, "overtime"),
        overtime_rate: confirmDraftJobOfferFormName(this.props.key, "overtime_rate")
      },
      ref_ids: {
        participant_id: confirmDraftJobOfferFormId(this.props.key, "participant_id"),
        position_id: confirmDraftJobOfferFormId(this.props.key, "position_id"),
        tipped: confirmDraftJobOfferFormId(this.props.key, "tipped"),
        hours: confirmDraftJobOfferFormId(this.props.key, "hours"),
        overtime: confirmDraftJobOfferFormId(this.props.key, "overtime"),
        overtime_rate: confirmDraftJobOfferFormId(this.props.key, "overtime_rate")
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
        overtimeRate = this.state[ref_names["overtime"]] === 'yes'
          ? <ReactBootstrap.Input name={ref_names["overtime_rate"]} id={ref_ids["overtime_rate"]} value={this.state[ref_names["overtime_rate"]]} hasFeedback bsStyle={validateMoney(this.state[ref_names["overtime_rate"]])} onChange={this.handleChange} label="Overtime rate per hour" addonBefore="$" type="text" labelClassName="col-sm-4" wrapperClassName="col-sm-8" />
          : null;

    return (
      <div>
        <ReactBootstrap.Input name={ref_names["participant_id"]} id={ref_ids["participant_id"]} defaultValue={this.props.key} type="hidden" />
        <ParticipantGroupParticipantOfferingFormPosition participantKey={this.props.key} positions={this.props.data.positions} />
        <ParticipantGroupParticipantOfferingFormWage participantKey={this.props.key} />
        <div className="form-group">
          <label className="col-xs-12 col-sm-4 control-label" htmlFor={ref_names["tipped"]}>Tipped Position</label>
          <div className="col-sm-8">
            <RadioGroup name={ref_names["tipped"]} id={ref_ids["tipped"]} value={this.state[ref_names["tipped"]]} className="btn-group btn-group-justified">
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={ref_ids["tipped"] + "_yes"} htmlFor={ref_ids["tipped"] + "_yes"} />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={ref_ids["tipped"] + "_no"} htmlFor={ref_ids["tipped"] + "_no"} />
            </RadioGroup>
          </div>
        </div>
        <ReactBootstrap.Input name={ref_names["hours"]} id={ref_ids["hours"]} value={this.state[ref_names["hours"]]}  label="Average hours per week" hasFeedback bsStyle={validateNumber(this.state[ref_names["hours"]])} labelClassName="col-sm-4" type="text" step="1" wrapperClassName="col-sm-8" onChange={this.handleChange} />
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor={ref_ids["overtime"]}>Are overtime hours available?</label>
          <div className="col-sm-8">
            <RadioGroup name={ref_names["overtime"]} id={ref_ids["overtime"]} value={this.state[ref_names["overtime"]]} className="btn-group btn-group-justified" onChange={this.handleChange}>
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" id={ref_ids["overtime"] + "_yes"} htmlFor={ref_ids["overtime"] + "_yes"} />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" id={ref_ids["overtime"] + "_no"} htmlFor={ref_ids["overtime"] + "_no"} />
              <RadioGroupButton title="Maybe" inputValue="maybe" iconClass="fa fa-question text-danger" id={ref_ids["overtime"] + "_maybe"} htmlFor={ref_ids["overtime"] + "_maybe"} />
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
                <ParticipantGroupParticipantOfferingForm key={this.props.key} data={this.props.data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
