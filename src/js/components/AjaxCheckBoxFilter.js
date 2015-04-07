/* @flow */
'use strict';

let React = require('react/addons');
let { UrlQueryMixin } = require('../mixins');
let { div, span, input, label } = React.DOM;

let AjaxCheckBoxFilter = React.createClass({
  displayName: 'AjaxCheckBoxFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    submit: React.PropTypes.func.isRequired,
    store: React.PropTypes.object.isRequired,
    predicate: React.PropTypes.oneOf(['eq_any', 'in_overlap']),
  },

  getDefaultProps () {
    return {
      predicate: 'eq_any'
    };
  },

  getInitialState () {
    return {
      isLoaded: !!this.props.store.data,
      ids: []
    };
  },

  getCheckedValues () {
    return this.getValueFromUrl(this.searchField());
  },

  componentDidMount () {
    if (!this.state.isLoaded) {
      this.stopListener = this.props.store.listen(() => {
        this.stopListener();
        let ids = this.getCheckedValues() || [];
        this.setState({ ids, isLoaded: true });
      });
    } else {
      let ids = this.getCheckedValues() || [];
      this.setState({ ids });
    }
  },

  onChange () {
    let ids = Object.keys(this.refs).
        map(refName => this.refs[refName].getDOMNode()).
        filter(ref => ref.checked).
        map(ref => ref.getAttribute('value'));

    this.setState({ ids }, this.props.submit);
  },

  searchField () {
    return `${this.props.fieldName}_${this.props.predicate}`;
  },

  query () {
    if (this.state.ids.length === 0) {
      return null;
    }

    let base = `q[${this.searchField()}][]=`;
    return this.state.ids.map(id => (base + id)).join('&');
  },

  render () {
    if (this.props.store.permission && this.props.store.data.length > 0 && this.state.isLoaded) {
      let stringIds = this.state.ids.map(obj => obj.toString());

      return (
        div({className: 'panel panel-default'},
          div({className: 'panel-heading'}, this.props.title),
          div({className: 'list-group list-group-scrollable'},
            this.props.store.data.map(option => {
              let checkboxAttributes = {
                type: 'checkbox',
                name: `${this.props.title.toLowerCase()}[${option.id}]`,
                value: option.id,
                onChange: this.onChange,
                ref: `option_${option.id}`
              };

              if (stringIds.indexOf(option.id.toString()) >= 0) {
                checkboxAttributes.checked = 'checked';
              }

              return label({key: `${this.props.title}_checkbox_${option.id}`, className: 'list-group-item'},
                input(checkboxAttributes),
                span({className: 'title'}, option.name)
              );
            })
          )
        )
      );
    }

    return null;
  }
});

module.exports = AjaxCheckBoxFilter;
