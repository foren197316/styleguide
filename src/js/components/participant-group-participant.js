var ParticipantGroupParticipant = React.createClass({
  render: function() {
    var listItemClass = this.props.data.gender == 'Female' ? 'list-group-item list-group-item-danger' : 'list-group-item list-group-item-info';

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
              <div className="col-xs-12 col-sm-4 col-lg-6">
                <i className="fa fa-globe"></i>
                <strong>{this.props.data.country_name}</strong>&nbsp;
              </div>
              <div className="col-xs-12 col-sm-4 text-right">
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
    console.log(event.target);
    this.setState({overtimeAvailable: event.target.value});
  },

  render: function() {
    var overtimeAvailable = this.state.overtimeAvailable,
        overtimeRate = function() {
          if (overtimeAvailable === 'yes') {
            return (
              <div className="form-group">
                <label className="col-sm-4 control-label" htmlFor="overtimeRatePerHour">Overtime rate per hour</label>
                <div className="col-sm-8">
                  <input className="form-control" placeholder="Overtime rate per hour" type="number" step="0.01" name="overtimeRatePerHour" />
                </div>
              </div>
            );
          }
        }();

    return (
      <div>
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor="jobTitle">Job Title</label>
          <div className="col-sm-8">
            <select className="form-control" name="jobTitle">
              <option value="" selected="selected" disabled="disabled">Job Title</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor="wagePerHour">Wage per hour</label>
          <div className="col-sm-8">
            <input className="form-control" placeholder="Wage per hour" type="number" step="0.01" name="wagePerHour" />
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-12 col-sm-4 control-label">Tipped Position</label>
          <div className="col-sm-8">
            <RadioGroup name="tippedPosition" className="btn-group btn-group-justified">
              <label className="btn btn-default">
                <input type="radio" value="yes" /> Yes
              </label>
              <label className="btn btn-default">
                <input type="radio" value="no" /> No
              </label>
            </RadioGroup>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor="averageHoursPerWeek">Average hours per week</label>
          <div className="col-sm-8">
            <input className="form-control" placeholder="Average hours per week" type="number" step="1" name="averageHoursPerWeek" />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-4 control-label" htmlFor="overtimeAvailable">Are overtime hours available?</label>
          <div className="col-sm-8">
            <RadioGroup name="overtimeAvailable" className="btn-group btn-group-justified" onChange={this.handleChange}>
              <label className="btn btn-default">
                <input type="radio" value="yes"/> Yes
              </label>
              <label className="btn btn-default">
                <input type="radio" value="no"/> No
              </label>
              <label className="btn btn-default">
                <input type="radio" value="maybe"/> Maybe
              </label>
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
    var listItemClass = this.props.data.gender == 'Female' ? 'list-group-item list-group-item-danger' : 'list-group-item list-group-item-info';

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
