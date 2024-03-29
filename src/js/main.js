'use strict';

let $ = require('jquery');
let Base64 = require('./base64');
let MetaStore = require('./stores/MetaStore');
let Reflux = require('reflux');
let axios = require('axios');
let csrfToken = require('./csrf-token');
let moment = require('moment');
let rootNode = require('./root-node');

let axiosDefaults = require('axios/lib/defaults');
axiosDefaults.headers.common['X-CSRF-Token'] = csrfToken;

$.ajaxPrefilter((options, originalOptions, xhr) => {
  if (!options.crossDomain) {
    if (csrfToken) {
      xhr.setRequestHeader('X-CSRF-Token', csrfToken);
    }
  }
});

moment.locale('en', {
  relativeTime: {
    future : 'in %s',
    past : '%s ago',
    s : 'a few seconds',
    m : '1 minute',
    mm : '%d minutes',
    h : '1 hour',
    hh : '%d hours',
    d : '1 day',
    dd : '%d days',
    M : '1 month',
    MM : '%d months',
    y : '1 year',
    yy : '%d years'
  }
});

if (process.env.__ENV__ === 'development') {
  global.Intercom = (action, name, data) => {
    console.log('Intercom', action, name, data);
  };
} else {
  let React = require('react/addons');

  global.onerror = (message) => {
    React.render(
      React.DOM.div({className: 'alert alert-danger'},
        React.DOM.strong({}, 'An error occurred: '), message
      ),
      rootNode
    );
    return false;
  };
}

String.prototype.capitaliseWord = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.camelCaseToUnderscore = function () {
  return this.replace(/([A-Z])/g, '_$1').toLowerCase();
};

Array.prototype.flatten = function () {
  return this.reduce((prev, curr) => (
    prev.concat(curr)
  ), []);
};

Array.prototype.diff = function(array) {
  return this.filter(i => (array.indexOf(i) < 0));
};

/* TODO: get rid of this and use the native ES6 "find" */
Array.prototype.findById = function (id, alternateKey) {
  var key = alternateKey || 'id';

  if (id instanceof Array) {
    return this.filter(entry => (
      id.indexOf(entry[key]) >= 0
    ));
  }

  for (var i=0; i<this.length; i++) {
    if (this[i][key] === id) {
      return this[i];
    }
  }
  return null;
};

Array.prototype.intersects = function (array) {
  if (array.length === 0 || this.length === 0) {
    return false;
  }

  for (var i=0; i<this.length; i++) {
    if (array.indexOf(this[i]) >= 0) {
      return true;
    }
  }

  return false;
};

Array.prototype.intersection = function (a) {
  return this.filter(entry => (
    a.indexOf(entry) >= 0
  ));
};

Array.prototype.mapAttribute = function (attribute) {
  try {
    return this.map(entry => (
      entry[attribute]
    ));
  } catch (e) {
    console.log(e);
  }
};

Array.prototype.notEmpty = function () {
  return this.filter(entry => (entry != null));
};

String.prototype.pluralize = function (count) {
  if (count === 1) {
    return this;
  } else {
    return this + 's';
  }
};

Array.prototype.uniq = function () {
  return this.reduce((prev, curr) => {
    if (prev.indexOf(curr) < 0) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

let traverse = function (subject, attributes) {
  let curr = subject;

  if (typeof attributes === 'string') {
    return curr[attributes];
  }

  for (let i=0; i<attributes.length; i++) {
    if (!curr) {
      return null;
    }
    curr = curr[attributes[i]];
  }

  return curr;
};

let dateGreaterThan = function (dateList, comparisonDate) {
  return dateList.reduce((prev, curr) => (
    prev || !curr.isBefore(comparisonDate)
  ), false);
};

let dateLessThan = function (dateList, comparisonDate) {
  return dateList.reduce((prev, curr) => (
    prev || !curr.isAfter(comparisonDate)
  ), false);
};

Reflux.StoreMethods.onAjaxLoad = function (...args) {
  var params = null;

  /* first argument may be an array of ids, the rest are treated as callbacks */
  if (args[0] instanceof Array) {
    params = { 'ids[]': args[0].notEmpty().sort().uniq() };
  }

  axios({
    url: rootNode.dataset[this.resourceName.camelCaseToUnderscore()],
    method: 'get',
    params
  })
  .then(response => {
    let newArgs = args;
    if (params != null) {
      newArgs = newArgs.slice(1);
    }
    this.onLoadSuccess(response.data, ...newArgs);
  }, this.onLoadError.bind(this))
  .catch(err => {
    console.log(err.stack);
  });
};

Reflux.StoreMethods.onAjaxSearch = function (query, ...callbacks) {
  if (this.xhr) {
    this.xhr.abort();
  }

  this.xhr = $.ajax({
    url: rootNode.dataset[this.resourceName.camelCaseToUnderscore()],
    type: 'POST',
    data: query,
    success: (response) => {
      if (query != null) {
        global.history.pushState(query, '', '#' + Base64.urlsafeEncode64(query));
      }

      callbacks.forEach(cb => cb(response));

      this.onSearchSuccess(response);
    },
    error: this.onSearchError.bind(this)
  });
};

Reflux.StoreMethods.onAjaxLoadSingleton = function (...args) {
  this.onSetSingleton();
  this.onAjaxLoad(...args);
};

Reflux.StoreMethods.onLoadSuccess = function (response, ...args) {
  this.data = response[this.resourceName.camelCaseToUnderscore()];
  MetaStore.set(response.meta);

  if (!(this.data instanceof Array) && !this.singleton) {
    this.data = [this.data].notEmpty();
  }

  if (this.data == null) {
    this.data = [];
  }

  this.permission = true;

  if (typeof this.initPostAjaxLoad === 'function') {
    this.initPostAjaxLoad(this.data, ...args);
  } else {
    this.trigger(this.data);
  }

  if (args.length > 0) {
    for (let i=0; i<args.length; i++) {
      args[i](response);
    }
  }
};

Reflux.StoreMethods.onLoadError = function () {
  this.data = [];
  this.permission = false;
  this.trigger(this.data);
};

Reflux.StoreMethods.onSearchSuccess = function (response) {
  this.data = response[this.resourceName.camelCaseToUnderscore()];
  MetaStore.set(response.meta);

  if (!(this.data instanceof Array)) {
    this.data = [this.data].notEmpty();
  }

  this.permission = true;
  this.trigger(this.data);
};

Reflux.StoreMethods.onSearchError = function () {
  this.data = [];
  this.permission = false;
  this.trigger(this.data);
};

Reflux.StoreMethods.genericIdFilter = function (filterKey, filterIds, condition) {
  this.filterIds = this.filterIds || {};

  if (filterIds == null || filterIds.length === 0) {
    this.filterIds[filterKey] = null;
  } else {
    this.filterIds[filterKey] = this.data.reduce(function (ids, entry) {
      if (condition(entry)) {
        ids.push(entry.id);
      }
      return ids;
    }, []);
  }

  this.emitFilteredData();
};

Reflux.StoreMethods.onSetData = function (data) {
  this.data = data;
  this.trigger(this.data);
};

Reflux.StoreMethods.onForceTrigger = function () {
  this.trigger(this.data);
};

Reflux.StoreMethods.onSetSingleton = function (customSingularResourceName) {
  this.singleton = true;
  this.resourceName = customSingularResourceName || this.resourceName.replace(/s$/, '');
};

Reflux.StoreMethods.onRemoveByIds = function (args, trigger) {
  if (typeof trigger === 'undefined') {
    trigger = true;
  }

  var ids = [].concat(args);
  var deleted = [];

  this.data = this.data.filter(function (entry) {
    if (ids.indexOf(entry.id) < 0) {
      return true;
    }
    deleted.push(entry);
    return false;
  });

  if (typeof this.cleanup === 'function') {
    this.cleanup(deleted);
  }

  if (trigger) {
    this.trigger(this.data);
  }
};

Reflux.StoreMethods.onResetSearch = function (identifier) {
  this.filterIds = this.filterIds || {};

  this.filterIds[identifier] = null;
  this['lastSearchTerm-' + identifier] = null;
  this.emitFilteredData();
};

Reflux.StoreMethods.onSearch = function (identifier, term, searchOn) {
  this.filterIds = this.filterIds || {};

  var searchIds = null;
  var searchFields = [].concat(searchOn);
  var terms = term.toLowerCase().split(/\s+/);
  var lastSearchAttribute = 'lastSearchTerm-' + identifier;
  var lastSearchTerm = this[lastSearchAttribute];

  if (lastSearchTerm && term.indexOf(lastSearchTerm) === 0) {
    searchIds = this.filterIds[identifier];
  } else {
    this.filterIds[identifier] = null;
  }

  var searchFieldsMatch = function (entry, value) {
    return searchFields.reduce(function (prev, curr) {
      return prev || (traverse(entry, curr) || '').toLowerCase().indexOf(value) >= 0;
    }, false);
  };

  var filterIds = this.data.reduce(function (idList, entry) {
    if (!searchIds || searchIds.indexOf(entry.id) >= 0) {
      var matches = terms.reduce(function (prev, curr) {
        return prev && searchFieldsMatch(entry, curr);
      }, true);

      if (matches) {
        idList.push(entry.id);
      }
    }

    return idList;
  }, []);

  this.filterIds[identifier] = filterIds;
  this[lastSearchAttribute] = term;
  this.emitFilteredData();
};

Reflux.StoreMethods.onDateFilter = function (searchFrom, searchTo, startFromDate, startToDate, finishFromDate, finishToDate) {
  var identifier = searchFrom + '-' + searchTo;

  if (startFromDate === null && startToDate === null && finishFromDate === null && finishToDate === null) {
    this.filterIds[identifier] = null;
  } else {
    this.filterIds[identifier] = this.data.reduce(function (ids, datum) {
      var fromDates = datum[searchFrom];
      var toDates = datum[searchTo];

      if (
          (startFromDate  === null || dateGreaterThan(fromDates, startFromDate))   &&
          (startToDate    === null || dateLessThan(toDates, startToDate))      &&
          (finishFromDate === null || dateGreaterThan(fromDates, finishFromDate))  &&
          (finishToDate   === null || dateLessThan(toDates, finishToDate))
         ) {
           ids.push(datum.id);
         }

      return ids;
    }, []);
  }

  this.emitFilteredData();
};

Reflux.StoreMethods.onFilterByIds = function (ids) {
  if (!ids || ids.length === 0) {
    this.trigger(this.data);
  } else {
    this.trigger(
      this.data.filter(function (entry) {
        return ids.indexOf(entry.id.toString()) >= 0;
      })
    );
  }
};

Reflux.StoreMethods.emitFilteredData = function () {
  var ids = null;
  var data;

  for (var i in this.filterIds) {
    if (this.filterIds.hasOwnProperty(i) && this.filterIds[i] !== null) {
      ids = (ids === null) ? this.filterIds[i] : ids.intersection(this.filterIds[i]);
    }
  }

  if (ids == null) {
    data = this.data;
  } else {
    data = this.data.filter(function (entry) {
      return ids.indexOf(entry.id) >= 0;
    });
  }

  this.trigger(data);
};

/* Convenience methods */
Reflux.StoreMethods.findById = function (id, attrName) {
  try {
    return this.data.findById(id, attrName);
  } catch (e) {
    console.log(e.stack);
  }
};

Reflux.StoreMethods.map = function (func) {
  return this.data.map(func);
};

Reflux.StoreMethods.mapAttribute = function (func) {
  return this.data.mapAttribute(func);
};
