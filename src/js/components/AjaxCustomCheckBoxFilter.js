/* @flow */
'use strict';
let React = require('react/addons');
let UrlQueryMixin = require('../mixins').UrlQueryMixin;
let { div, span, label, input } = React.DOM;

let AjaxCustomCheckBoxFilter = React.createClass({
  displayName: 'AjaxCustomCheckBoxFilter',
  mixins: [UrlQueryMixin],

  propTypes: {
    title: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    store: React.PropTypes.object.isRequired,
    submit: React.PropTypes.func.isRequired,
    mutuallyExclusive: React.PropTypes.bool
  },

  getDefaultProps () {
    return {
      mutuallyExclusive: true
    };
  },

  getInitialState () {
    return {
      isLoaded: !!this.props.store.data,
      ids: []
    };
  },

  getCheckedValues () {
    return this.props.store.data.map(datum => {
      if (this.getValueFromUrl(this.getFieldName(datum.id))) {
        return datum.id;
      }
    }).notEmpty();
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
      this.setState({ ids, isLoaded: true });
    }
  },

  onChange () {
    let ids = Object.keys(this.refs).
        map(refName => this.refs[refName].getDOMNode()).
        filter(ref => ref.checked).
        map(ref => ref.getAttribute('value'));

    this.setState({ ids }, this.props.submit);
  },

  getFieldName (id) {
    return `${this.props.fieldName}_${id}`;
  },

  query () {
    if (this.state.ids.length === 0 || (this.props.mutuallyExclusive && this.state.ids.length !== 1)) {
      return null;
    }

    return this.state.ids.map(id => (
      `q[${this.getFieldName(id)}]=${this.props.store.findById(id).value}`
    )).join('&');
  },

  render () {
    if (this.props.store.permission && this.props.store.data.length > 0 && this.state.isLoaded) {
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

              if (this.state.ids.indexOf(option.id) >= 0) {
                checkboxAttributes.checked = 'checked';
              }

              return (
                label({key: `${this.props.title}_checkbox_${option.id}`, className: 'list-group-item'},
                  input(checkboxAttributes),
                  span({className: 'title'}, option.name)
                )
              );
            })
          )
        )
      );
    }

    return div();
  }
});

module.exports = AjaxCustomCheckBoxFilter;
