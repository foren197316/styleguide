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
    formSending: React.PropTypes.object.isRequired,
    anchor: React.PropTypes.string,
    recordName: React.PropTypes.string,
    maxPages: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      page: 1,
      pageCount: 1,
      anchor: null,
      recordName: 'Records',
      maxPages: 9
    };
  },

  getInitialState: function () {
    return {
      page: this.props.page
    };
  },

  onClick: function (page) {
    if (this.props.anchor) {
      global.location = '#' + this.props.anchor;
    }

    this.props.formSending.requestChange(true);
    this.setState({ page: page });

    var queryWithPage;
    var originalQuery = query.getQuery();

    if (originalQuery && originalQuery.length > 0) {
      queryWithPage = originalQuery.replace(/&?\bpage=\d+\b/i, '&page=' + page);
    } else {
      queryWithPage = 'page=' + page;
    }

    this.props.actions.ajaxSearch(queryWithPage, function () {
      this.props.formSending.requestChange(false);
    }.bind(this));
  },

  makeButtons: function (pageNumbers) {
    var buttons = [];
    var lastPage;

    for (var i=0; i<pageNumbers.length; i++) {
      var currentPage = pageNumbers[i];
      if (lastPage && (currentPage - lastPage) > 1) {
        buttons.push(
          React.DOM.li({className: 'disabled'},
            React.DOM.a({key: 'pagination-ellipsis-'+currentPage}, '...')
          )
        );
      }

      var active = (currentPage.toString() === this.state.page.toString()) ? ' active' : '';
      buttons.push(
        React.DOM.li({className: active},
          React.DOM.a({href: '#', onClick: this.onClick.bind(this, currentPage), key: 'pagination-'+currentPage}, currentPage)
        )
      );
      lastPage = currentPage;
    }
    return buttons;
  },

  getPagination: function () {
    var pageCount = this.props.pageCount;

    if (pageCount <= 1) {
      return [];
    }

    var pages = [];

    if (pageCount <= this.props.maxPages) {
      for (var i=1; i<=pageCount; i++) {
        pages.push(i);
      }
    } else if (this.state.page <= 4) {
      pages = pages.concat([1, 2, 3, 4, 5, 6, pageCount-1, pageCount]);
    } else if (this.state.page > pageCount - 4) {
      pages = pages.concat([1, 2, pageCount-5, pageCount-4, pageCount-3, pageCount-2, pageCount-1, pageCount]);
    } else {
      pages = pages.concat([1, 2, this.state.page-1, this.state.page, this.state.page+1, pageCount-1, pageCount]);
    }

    return this.makeButtons(pages);
  },

  render: function () {
    return React.DOM.div({className: 'row react-pagination'},
      React.DOM.div({className: 'col-xs-12 col-md-4'},
        React.DOM.div({className: 'count label label-default'}, this.props.recordCount + ' ' + this.props.recordName)
      ),
      React.DOM.div({className: 'col-xs-12 col-md-8 text-right'},
        React.DOM.nav(null,
          React.DOM.ul({className: 'pagination'}, this.getPagination())
        )
      )
    );
  }
});
