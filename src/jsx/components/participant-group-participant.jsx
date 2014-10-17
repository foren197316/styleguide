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

var ParticipantGroupParticipantOfferingForm = React.createClass({
  getInitialState: function() {
    return {overtimeAvailable: null};
  },

  handleChange: function(event) {
    this.setState({overtimeAvailable: event.target.value});
  },

  validationState: function() {
    console.log(this.state);
  },

  render: function() {
    var overtimeAvailable = this.state.overtimeAvailable,
        overtimeRate = function() {
          if (overtimeAvailable === 'yes') {
            return (
              <ReactBootstrap.Input label="Overtime rate per hour" addonBefore="$" type="number" step="0.01" labelClassName="col-sm-2" wrapperClassName="col-sm-10" />
            );
          }
        }();

    return (
      <div>
        <ReactBootstrap.Input type="select" defaultValue="" labelClassName="col-sm-2" wrapperClassName="col-sm-10" label="Job Title">
          <option value="" disabled="disabled">Job Title</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </ReactBootstrap.Input>
        <ReactBootstrap.Input label="Wage per hour" labelClassName="col-sm-2" type="number" step="0.01" addonBefore="$" wrapperClassName="col-sm-10" />
        <div className="form-group">
          <label className="col-xs-12 col-sm-4 control-label">Tipped Position</label>
          <div className="col-sm-8">
            <RadioGroup name="tippedPosition" className="btn-group btn-group-justified">
              <RadioGroupButton title="Yes" inputValue="yes" iconClass="fa fa-check text-success" />
              <RadioGroupButton title="No" inputValue="no" iconClass="fa fa-close text-danger" />
            </RadioGroup>
          </div>
        </div>
        <ReactBootstrap.Input  label="Average hours per week" labelClassName="col-sm-2" type="number" step="1" wrapperClassName="col-sm-10" />
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor="overtimeAvailable">Are overtime hours available?</label>
          <div className="col-sm-8">
            <RadioGroup name="overtimeAvailable" className="btn-group btn-group-justified" onChange={this.handleChange}>
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
                <ParticipantGroupParticipantOfferingForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
