var SearchFilter = React.createClass({displayName: 'SearchFilter',
  propTypes: {
    title: React.PropTypes.string.isRequired,
    searchOn: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]).isRequired,
    actions: React.PropTypes.object.isRequired, /* TODO: require Reflux Actions */
    inputCharacterMinimum: React.PropTypes.number,
    autoFocus: React.PropTypes.bool,
    placeholder: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      inputCharacterMinimum: 3,
      autoFocus: true,
      placeholder: "Search"
    }
  },

  componentDidMount: function () {
    if (this.props.autoFocus) {
      this.refs["searchInput"].getDOMNode().focus();
    }
  },

  handleChange: function (event) {
    var term = event.target.value;

    if (term.length >= this.props.inputCharacterMinimum) {
      this.props.actions.search(this.props.title, term, this.props.searchOn);
    } else {
      this.props.actions.resetSearch(this.props.title);
    }
  },

  render: function () {
    return (
      React.DOM.label({className: "list-group"},
        React.DOM.input({type: "search", ref: "searchInput", name: "search_"+this.props.title, onChange: this.handleChange, className: "list-group-item form-control", placeholder: this.props.placeholder})
      )
    )
  }
});
