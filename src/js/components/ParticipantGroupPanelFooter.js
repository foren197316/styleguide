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
            return ParticipantGroupPanelFooterName({name: name}, child);
          } else {
            return (
              React.DOM.div({className: 'row'},
                React.DOM.div({className: 'col-xs-12 text-right'},
                  React.DOM.hr(null),
                  child
                )
              )
            );
          }
        }) || ParticipantGroupPanelFooterName({name: name});

    return (
      React.DOM.div({className: 'panel-footer clearfix'},
        children
      )
    );
  }
});
