'use strict';

var React = require('react/addons');

var ParticipantGroupPanelFooterName = React.createClass({displayName: 'ParticipantGroupPanelFooterName',
  propTypes: { name: React.PropTypes.string.isRequired },

  render: function () {
    return (
      React.DOM.div({className: 'row'},
        React.DOM.div({className: 'col-xs-6 col-sm-6'},
          React.DOM.div({className: 'panel-title pull-left', style: { 'whiteSpace': 'nowrap'}},
            this.props.name
          )
        ),
        React.DOM.div({className: 'col-xs-6 col-sm-6'},
          React.DOM.div({className: 'pull-right'},
            this.props.children
          )
        )
      )
    );
  }
});

var ParticipantGroupPanelFooter = React.createClass({displayName: 'ParticipantGroupPanelFooter',
  propTypes: {
    name: React.PropTypes.string.isRequired
  },

  render: function () {
    var name = this.props.name,
        children = React.Children.map(this.props.children, function (child, index) {
          if (child == null) {
            return;
          }

          if (index === 0) {
            return React.createElement(ParticipantGroupPanelFooterName, {name: name}, child);
          } else {
            return (
              React.DOM.div({className: 'row'},
                React.DOM.div({className: 'col-xs-12 text-right'},
                  React.DOM.hr({}),
                  child
                )
              )
            );
          }
        }) || React.createElement(ParticipantGroupPanelFooterName, {name: name});

    return (
      React.DOM.div({className: 'panel-footer clearfix'},
        children
      )
    );
  }
});

module.exports = ParticipantGroupPanelFooter;
