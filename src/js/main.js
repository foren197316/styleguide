'use strict';

var actions = require('./actions');
var Reflux = require('reflux');
var $ = require('jquery');
var Base64 = require('./base64');

$.ajaxPrefilter(function(options, originalOptions, xhr) {
  if (!options.crossDomain) {
    var token = $('meta[name="csrf-token"]').attr('content');
    if (token) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  }
});

String.prototype.capitaliseWord = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.camelCaseToUnderscore = function () {
  return this.replace(/([A-Z])/g, '_$1').toLowerCase();
};

Array.prototype.flatten = function () {
  return this.reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []);
};

Array.prototype.diff = function(array) {
  return this.filter(function(i) {return array.indexOf(i) < 0;});
};

Array.prototype.findById = function (id, alternateKey) {
  var key = alternateKey || 'id';

  if (id instanceof Array) {
    return this.filter(function (entry) {
      return id.indexOf(entry[key]) >= 0;
    });
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
  return this.filter(function (entry) {
    return a.indexOf(entry) >= 0;
  });
};

Array.prototype.mapAttribute = function (attribute) {
  try {
    return this.map(function (entry) {
      return entry[attribute];
    });
  } catch (e) {
    console.log(e.stack);
  }
};

Array.prototype.notEmpty = function () {
  return this.filter(function (entry) {
    return entry != null;
  });
};

String.prototype.pluralize = function (count) {
  if (count === 1) {
    return this;
  } else {
    return this + 's';
  }
};

Array.prototype.uniq = function () {
  return this.reduce(function (prev, curr) {
    if (prev.indexOf(curr) < 0) {
      prev.push(curr);
    }
    return prev;
  }, []);
};

var traverse = function (subject, attributes) {
  var curr = subject;

  if (typeof attributes === 'string') {
    return curr[attributes];
  }

  for (var i=0; i<attributes.length; i++) {
    if (!curr) {
      return null;
    }
    curr = curr[attributes[i]];
  }

  return curr;
};

var dateGreaterThan = function (dateList, comparisonDate) {
  return dateList.reduce(function (prev, curr) {
    return prev || !curr.isBefore(comparisonDate);
  }, false);
};

var dateLessThan = function (dateList, comparisonDate) {
  return dateList.reduce(function (prev, curr) {
    return prev || !curr.isAfter(comparisonDate);
  }, false);
};

var UrlStore = Reflux.createStore({
  urls: null,

  init: function () {
    this.listener = this.listenTo(actions.setUrls, this.onSetUrls);
  },

  onSetUrls: function (urls) {
    this.listener.stop();
    this.urls = urls;
    this.trigger(this.urls);
  }
});

Reflux.StoreMethods.onAjaxLoad = function () {
  var args = arguments;
  var data = null;

  /* first argument may be an array of ids, the rest are treated as callbacks */
  if (args[0] instanceof Array) {
    data = { ids: args[0].notEmpty().sort().uniq() };
  }

  var doAjaxLoad = function (urls) {
    $.ajax({
      url: urls[this.resourceName],
      type: 'GET',
      data: data,
      success: function (response) {
        if (data !== null) {
          [].shift.call(args);
        }
        [].unshift.call(args, response);
        this.onLoadSuccess.apply(this, args);
      }.bind(this),
      error: this.onLoadError.bind(this)
    });
  }.bind(this);

  if (UrlStore.urls != null) {
    doAjaxLoad(UrlStore.urls);
  } else {
    this.urlListener = this.listenTo(actions.setUrls, function (urls) {
      this.urlListener.stop();
      doAjaxLoad(urls);
    }.bind(this));
  }
};

Reflux.StoreMethods.onAjaxSearch = function (query, callback) {
  var doAjaxLoad = function (urls) {
    $.ajax({
      url: urls[this.resourceName],
      type: 'POST',
      data: query,
      success: function (response) {
        if (query) {
          global.history.pushState(query, '', '#' + Base64.urlsafeEncode64(query));
        }

        if (typeof callback === 'function') {
          callback(response);
        }
        this.onSearchSuccess(response);
      }.bind(this),
      error: this.onSearchError.bind(this)
    });
  }.bind(this);

  if (UrlStore.urls != null) {
    doAjaxLoad(UrlStore.urls);
  } else {
    this.urlListener = this.listenTo(actions.setUrls, function (urls) {
      this.urlListener.stop();
      doAjaxLoad(urls);
    }.bind(this));
  }
};

Reflux.StoreMethods.onAjaxLoadSingleton = function () {
  this.onSetSingleton();
  var args = arguments;
  this.onAjaxLoad.apply(this, args);
};

Reflux.StoreMethods.onLoadSuccess = function (response) {
  var args = arguments;

  this.data = response[this.resourceName.camelCaseToUnderscore()];

  if (!(this.data instanceof Array)) {
    this.data = [this.data].notEmpty();
  }

  this.permission = true;

  if (typeof this.initPostAjaxLoad === 'function') {
    [].shift.call(args);
    [].unshift.call(args, this.data);
    this.initPostAjaxLoad.apply(this, args);
  } else {
    this.trigger(this.data);
  }

  if (args.length > 1) {
    for (var i=1; i<args.length; i++) {
      args[i](this.data);
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
  this.pageCount = response.meta.pageCount;

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

global.AwaitingOrdersParticipantGroupPanels = require('./components/AwaitingOrdersParticipantGroupPanels');
global.InMatchingParticipantGroupsIndex = require('./components/InMatchingParticipantGroupsIndex');
global.ReservedParticipantGroupPanels = require('./components/ReservedParticipantGroupPanels');
global.OnReviewParticipantGroupPanels = require('./components/OnReviewParticipantGroupPanels');
global.OfferedParticipantGroupsIndex = require('./components/OfferedParticipantGroupsIndex');
global.JobOfferGroupsIndex = require('./components/JobOfferGroupsIndex');
global.JobOfferParticipantAgreementsIndex = require('./components/JobOfferParticipantAgreementsIndex');
