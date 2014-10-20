mlcl_forms.form = angular.module('mlcl_forms.list', [
  'mlcl_forms',
  'mlcl_forms.services',
  'ui.bootstrap',
  'ngTable'
]).directive('mlclFormList', [
  '$compile',
  '$injector',
  '$rootScope',
  '$filter',
  '$templateCache',
  'apiService',
  'growl',
  'ngTableParams',
  function ($compile, $injector, $rootScope, $filter, $templateCache, ApiService, growl, ngTableParams) {
    return {
      scope: {},
      restrict: 'EA',
      templateUrl: 'list/list.tpl.html',
      link: function (scope, element, attrs) {
        scope.attrs = attrs;
        if (attrs.page) {
          scope.page = attrs.page;
        } else {
          scope.page = 1;
        }
        if (attrs.pageSize) {
          scope.pageSize = attrs.pageSize;
        } else {
          scope.pageSize = 50;
        }
        scope.filterinput = { myfilter: '' };
        scope.$watch('filterinput.myfilter', function (newVal) {
          _.each(scope.columns, function (item) {
            scope.filters[item.field] = newVal;
          });
        });
        scope.filters = {};
        var api = new ApiService(scope, attrs.modelname, attrs.apihost);
        scope.api = api;
        var NgTableParams = ngTableParams;
        scope.tableParams = new NgTableParams({
          page: 1,
          count: 10,
          sorting: { name: 'asc' },
          filter: scope.filters
        }, {
          total: 0,
          getData: function ($defer, params) {
            api.element.get(params.url(), function (result) {
              if (result) {
                scope.listfields = result.listFields;
                scope.columns = result.listFields;
                if (!result.listFields) {
                  scope.listfields = [{ field: '_id' }];
                } else if (result.listFields.length === 0) {
                  scope.listfields = [{ field: '_id' }];
                } else if (result.listFields.length === 1 && result.listFields[0].field === 'lang') {
                  if (result.hits.length > 0) {
                    if (result.hits[0].title) {
                      scope.listfields.unshift({ field: 'title' });
                    } else {
                      scope.listfields.unshift({ field: '_id' });
                    }
                  }
                }
                params.total(result.total);
                $defer.resolve(result.hits);
              }
            });
          }
        });
        scope.$watch('pages', function (newVal) {
          var pagearray = [];
          var i = 1;
          while (i <= scope.pages) {
            pagearray.push(i);
            i++;
          }
          scope.pagearray = pagearray;
        });
        scope.changepage = function (mypage) {
          scope.page = mypage;
        };
        if (attrs.modelname) {
          scope.modelname = attrs.modelname;
        }
        if (attrs.apihost) {
          this.apihost = attrs.apihost;
        }
      }
    };
  }
]).directive('loadingContainer', function () {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope, element, attrs) {
      var loadingLayer = angular.element('<div class="loading"></div>');
      element.append(loadingLayer);
      element.addClass('loading-container');
      scope.$watch(attrs.loadingContainer, function (value) {
        loadingLayer.toggleClass('ng-hide', !value);
      });
    }
  };
});