/** @jsx React.DOM */

var ParticipantGroupPanels = React.createClass({
  getInitialState: function() {
    return {
      data: null
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(data) {
      if (this.isMounted()) {
        this.setState({
          data: data.participant_groups
        });
      }
    }.bind(this));
  },

  render: function() {
    if (this.isMounted()) {
      var participantGroupNodes = this.state.data.map(function (participantGroup) {
        return (
          <ParticipantGroup data={participantGroup} />
        );
      });
    };

    return (
      <div id="participant-group-panels">
        {participantGroupNodes}
      </div>
    );
  }
});

var ParticipantGroup = React.createClass({
  render: function() {
    var applicationNodes = this.props.data.participants.map(function (application) {
      return (
        <ParticipantGroupApplication data={application} />
      )
    });

    return (
      <div className="panel participant-group-panel">
        <div className="list-group">
          {applicationNodes}
        </div>
        <div className="panel-footer clearfix">
          <div className="row">
            <div className="col-xs-12 visible-xs">
              <ParticipantGroupBtnGroup className="btn-group btn-group-justified" />
              <hr/>
            </div>
            <div className="col-xs-12 visible-xs">
              <div className="row">
                <div className="col-xs-6">
                  <div className="panel-title">{this.props.data.name}</div>
                </div>
                <div className="col-xs-6">
                  <button className="btn btn-success pull-right">Put on Review</button>
                </div>
              </div>
            </div>
            <div className="col-sm-9 hidden-xs">
              <div className="panel-title pull-left">{this.props.data.name}</div>
              <ParticipantGroupBtnGroup />
            </div>
            <div className="col-sm-3 hidden-xs">
              <button className="btn btn-success pull-right">Put on Review</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var ParticipantGroupBtnGroup = React.createClass({
  render: function() {
    return (
      <div className={this.props.className}>
        <a className="btn btn-text active">Basics</a>
        <a className="btn btn-text">Skills</a>
        <a className="btn btn-text">Positions</a>
        <a className="btn btn-text">Places</a>
      </div>
    )
  }
});

var ParticipantGroupApplication = React.createClass({
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
              <div className="col-xs-12 col-sm-4 col-md-6">
                <i className="fa fa-globe"></i>
                <strong>{this.props.data.country}</strong>&nbsp;
              </div>
              <div className="col-xs-12 col-sm-2 text-right">
                <ParticipantGroupApplicationGenderIcon gender={this.props.data.gender} />
                21+
              </div>
              <div className="col-xs-12 col-sm-3 col-md-2 text-right">
                <i className="fa fa-plane fa-flip-vertical"></i>
                {this.props.data.arrival_date}
              </div>
              <div className="col-xs-12 col-sm-3 col-md-2 text-right">
                <i className="fa fa-plane"></i>
                {this.props.data.departure_date}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var ParticipantGroupApplicationGenderIcon = React.createClass({
  render: function() {
    var genderIconClass = "fa fa-" + this.props.gender.toLowerCase();

    return (
      <i className={genderIconClass}></i>
    )
  }
});
