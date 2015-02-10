/* @flow */
'use strict';

var React = require('react/addons');
var query = require('../query');

module.exports = React.createClass({displayName: 'Pagination',
  propTypes: {
    pageCount: React.PropTypes.number.isRequired,
    recordCount: React.PropTypes.number.isRequired,
    actions: React.PropTypes.object.isRequired,
    page: React.PropTypes.number,
    formSending: React.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      page: 1,
      pageCount: 1
    };
  },

  getInitialState: function () {
    return {
      page: this.props.page
    };
  },

  onClick: function (page) {
    this.props.formSending.requestChange(true);
    this.setState({ page: page });

    var queryWithPage;
    var originalQuery = query.getQuery();

    if (originalQuery && originalQuery.length > 0) {
      queryWithPage = originalQuery.replace(/&?\bpage=\d+\b/i, '') + '&page=' + page;
    } else {
      queryWithPage = 'page=' + page;
    }

    this.props.actions.ajaxSearch(queryWithPage, function () {
      this.props.formSending.requestChange(false);
    }.bind(this));
  },

  render: function () {
    var buttons = [];
    if (this.props.pageCount > 1) {
      for (var i=1; i<=this.props.pageCount; i++) {
        buttons.push(
          React.DOM.button({className: 'btn btn-default', onClick: this.onClick.bind(this, i), disabled: (i.toString()===this.state.page.toString()) ? 'disabled' : '', key: 'pagination-'+i}, i)
        );
      }
    }

    return React.DOM.div({className: 'row'},
      React.DOM.div({className: 'col-xs-4'},
        React.DOM.div({className: 'label label-default', style: {'fontSize': '20px'}}, this.props.recordCount + ' Participants')
      ),
      React.DOM.div({className: 'col-xs-8'},
        React.DOM.div({className: 'btn-group pull-right'}, buttons)
      )
    );
  }
});
