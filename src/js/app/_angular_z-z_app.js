var app = angular
            .module('InterExchange::Angular', ['ngRoute', '$strap.directives'])
            .value('$strapConfig', {
              datepicker: {
                format: 'mm/dd/yyyy'
              }
            });
