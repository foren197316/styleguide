'use strict';

var React = require('react/addons');
var globals = require('../globals');
var dateFormatMDY = globals.dateFormatMDY;
var dateFormatYMD = globals.dateFormatYMD;
var LinkToIf = require('./LinkToIf');
var YearCalculator = require('./YearCalculator');
var moment = require('moment');

var ParticipantGroupParticipant = React.createClass({displayName: 'ParticipantGroupParticipant',
  propTypes: {
    participant: React.PropTypes.object.isRequired
  },

  render: function () {
    var participant = this.props.participant,
        hr = React.Children.count(this.props.children) > 0 ? React.DOM.hr({}) : null;

    return (
      React.DOM.div({className: 'list-group-item list-group-item-participant', 'data-participant-name': participant.name},
        React.DOM.div({className: 'media'},
          React.DOM.img({className: 'media-object img-circle img-thumbnail pull-left', src: participant.photo_url + '/convert?h=100&w=100&fit=crop', alt: participant.name}),
          React.DOM.div({className: 'media-body'},
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12'},
                React.DOM.h4({className: 'media-heading'},
                  React.createElement(LinkToIf, {name: participant.name, href: participant.href})
                )
              )
            ),
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12 col-md-6'},
                React.DOM.strong({}, participant.country_name),
                React.DOM.br({}),
                React.DOM.strong({}, React.createElement(YearCalculator, {from: participant.date_of_birth, to: participant.arrival_date})),
                React.DOM.strong({style: { 'paddingLeft': '5px'}}, participant.gender)
              )
            ),
            React.DOM.hr({}),
            React.DOM.div({className: 'row'},
              React.DOM.div({className: 'col-xs-12 col-md-4 col-md-offset-4'},
                React.DOM.div({className: 'row text-right'},
                  React.DOM.div({className: 'col-xs-6 col-md-10'},
                    React.DOM.strong({}, 'English ', React.DOM.span({className: 'hidden-xs'}, 'Level'), ' ')
                  ),
                  React.DOM.div({className: 'col-xs-6 col-md-2'},
                    React.DOM.span({}, participant.english_level)
                  )
                )
              ),
              React.DOM.div({className: 'col-xs-12 col-md-4'},
                React.DOM.div({className: 'row text-right'},
                  React.DOM.div({className: 'col-xs-6 col-md-5 col-lg-7'},
                    React.DOM.strong({}, 'Availability')
                  ),
                  React.DOM.div({className: 'col-xs-6 col-md-7 col-lg-5'},
                    React.DOM.span({}, moment(participant.arrival_date, dateFormatYMD).add(2, 'days').format(dateFormatMDY)),
                    React.DOM.br({}),
                    React.DOM.span({}, moment(participant.departure_date, dateFormatYMD).format(dateFormatMDY))
                  )
                )
              )
            ),
            hr,
            React.Children.map(this.props.children, function (child) {
              return (
                React.DOM.div({className: 'row'},
                  React.DOM.div({className: 'col-xs-12'},
                    child
                  )
                )
              );
            })
          )
        )
      )
    );
  }
});

module.exports = ParticipantGroupParticipant;
