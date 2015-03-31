/* @flow */
'use strict';

let React = require('react/addons');
let query = require('../query');
let { li, a, div, ul, nav } = React.DOM;

let Pagination = React.createClass({
  displayName: 'Pagination',
  propTypes: {
    pageCount: React.PropTypes.number.isRequired,
    recordCount: React.PropTypes.number.isRequired,
    actions: React.PropTypes.object.isRequired,
    page: React.PropTypes.number,
    formSending: React.PropTypes.object.isRequired,
    anchor: React.PropTypes.string,
    recordName: React.PropTypes.string,
    maxPages: React.PropTypes.number,
    callbacks: React.PropTypes.array
  },

  getDefaultProps () {
    return {
      page: 1,
      pageCount: 1,
      anchor: null,
      recordName: 'Record',
      maxPages: 9
    };
  },

  getInitialState () {
    return {
      page: this.props.page
    };
  },

  onClick (page) {
    let queryWithPage = '';
    let originalQuery = query.getQuery();

    if (this.props.anchor) {
      global.location = '#' + this.props.anchor;
    }

    this.props.formSending.requestChange(true);
    this.setState({ page });

    if (/\bpage=/i.test(originalQuery)) {
      queryWithPage = originalQuery.replace(/&?\bpage=\d+\b/i, `&page=${page}`);
    } else {
      queryWithPage = `${originalQuery}&page=${page}`;
    }

    let callbacks = (this.props.callbacks || []).concat([() => {
      this.props.formSending.requestChange(false);
    }]);

    this.props.actions.ajaxSearch(queryWithPage, ...callbacks);
  },

  makeButtons (pageNumbers) {
    let buttons = [];
    var lastPage;

    for (let i=0; i<pageNumbers.length; i++) {
      let currentPage = pageNumbers[i];
      if (lastPage && (currentPage - lastPage) > 1) {
        buttons.push(
          li({className: 'disabled', key: `ellipsis-${i}`},
            a({key: `pagination-ellipsis-${currentPage}`}, '...')
          )
        );
      }

      let active = (currentPage.toString() === this.state.page.toString()) ? ' active' : '';
      buttons.push(
        li({className: active, key: `page-${currentPage}`},
          a({href: '#', onClick: this.onClick.bind(this, currentPage), key: `pagination-${currentPage}`}, currentPage)
        )
      );
      lastPage = currentPage;
    }
    return buttons;
  },

  getPagination () {
    let pageCount = this.props.pageCount;

    if (pageCount <= 1) {
      return [];
    }

    let pages = [];

    if (pageCount <= this.props.maxPages) {
      for (let i=1; i<=pageCount; i++) {
        pages.push(i);
      }
    } else if (this.state.page <= 4) {
      pages = [1, 2, 3, 4, 5, 6, pageCount-1, pageCount];
    } else if (this.state.page > pageCount - 4) {
      pages = [1, 2, pageCount-5, pageCount-4, pageCount-3, pageCount-2, pageCount-1, pageCount];
    } else {
      pages = [1, 2, this.state.page-1, this.state.page, this.state.page+1, pageCount-1, pageCount];
    }

    return this.makeButtons(pages);
  },

  render () {
    let { recordCount, recordName } = this.props;

    return div({className: 'row react-pagination'},
      div({className: 'col-xs-12 col-md-4'},
        div({className: 'count label label-default'}, `${recordCount} ${recordName.pluralize(recordCount)}`)
      ),
      div({className: 'col-xs-12 col-md-8 text-right'},
        nav({},
          ul({className: 'pagination'}, this.getPagination())
        )
      )
    );
  }
});

module.exports = Pagination;
