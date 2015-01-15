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
