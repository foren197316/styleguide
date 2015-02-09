/* @flow */
'use strict';

var React = require('react/addons');
var query = require('../query');

module.exports = React.createClass({displayName: 'Pagination',
  propTypes: {
    pageCount: React.PropTypes.number.isRequired,
    actions: React.PropTypes.object.isRequired,
    page: React.PropTypes.number
  },

  getDefaultProps: function () {
    return { page: 1 };
  },

  getInitialState: function () {
    return {
      page: this.props.page
    };
  },

  onClick: function (page) {
    this.setState({ page: page });
    var queryWithPage;
    var originalQuery = query.getQuery();
    if (originalQuery && originalQuery.length > 0) {
      queryWithPage = originalQuery.replace(/&?\bpage=\d+\b/i, '') + '&page=' + page;
    } else {
      queryWithPage = 'page=' + page;
    }
    this.props.actions.ajaxSearch(queryWithPage);
  },

  render: function () {
    var buttons = [];
    for (var i=1; i<=this.props.pageCount; i++) {
      buttons.push(
        React.DOM.button({className: 'btn btn-default', onClick: this.onClick.bind(this, i), disabled: (i.toString()===this.state.page.toString()) ? 'disabled' : '', key: 'pagination-'+i}, i)
      );
    }

    return React.DOM.div({className: 'row'},
      React.DOM.div({className: 'col-xs-12'},
        React.DOM.div({className: 'btn-group pull-right'}, buttons)
      )
    );
  }
});
