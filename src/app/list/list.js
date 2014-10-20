mlcl_forms.form = angular.module( 'mlcl_forms.list', [
  'mlcl_forms',
  // should later be provided by plugin textArea
  'mlcl_forms.services',
  'ui.bootstrap',
  'ngTable'
])
.directive('mlclFormList', ['$compile', '$injector', '$rootScope', '$filter', '$templateCache', 'apiService', 'growl', 'ngTableParams', function ($compile, $injector, $rootScope, $filter, $templateCache, ApiService, growl, ngTableParams) {
    return {
      scope: {},
      restrict: 'EA',
      templateUrl: 'list/list.tpl.html',
      link: function (scope, element, attrs) {
        // Add the attributes to the scope
        scope.attrs = attrs;

        if(attrs.page) {
          scope.page = attrs.page;
        } else {
          scope.page = 1;
        }

        if(attrs.pageSize) {
          scope.pageSize = attrs.pageSize;
        } else {
          scope.pageSize = 50;
        }

        scope.filterinput = {
          myfilter: ''
        };

        scope.$watch('filterinput.myfilter', function(newVal) {
          _.each(scope.columns, function(item) {
            scope.filters[item.field] = newVal;
          });
        });

        scope.filters = {
        };

        var api = new ApiService(scope, attrs.modelname, attrs.apihost);

        // add to scope to use it in the tempalte
        scope.api = api;

        var NgTableParams = ngTableParams;

        scope.tableParams = new NgTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          sorting: {
              name: 'asc'     // initial sorting
          },
          filter: scope.filters
        }, {
          total: 0,           // length of data
          getData: function($defer, params) {
            api.element.get(params.url(), function(result) {
              if(result) {
                scope.listfields = result.listFields;
                scope.columns = result.listFields;
                if(!result.listFields) {
                  scope.listfields = [{
                    field:'_id'
                  }];
                } else if(result.listFields.length === 0) {
                  scope.listfields = [{
                    field:'_id'
                  }];
                }
                // update table params
                params.total(result.total);
                // set new data
                $defer.resolve(result.hits);
              }
            });
          }
        });

        scope.$watch('pages', function(newVal) {
          var pagearray = [];
          var i = 1;
          while(i <= scope.pages) {
            pagearray.push(i);
            i++;
          }
          scope.pagearray = pagearray;
        });


        /*scope.$watch('page', function(newVal) {
          api.listCollection(scope.page, scope.pageSize, function(err, result) {
            if(result) {
              if(result.listFields) {
                scope.listfields = result.listFields;
              }

              if(!result.listFields) {
                scope.listfields = [{
                  field:'_id'
                }];
              } else if(result.listFields.length === 0) {
                scope.listfields = [{
                  field:'_id'
                }];
              }
              scope.elements = result.hits;
              scope.pages = result.pages;
            }
          });
        });*/

        scope.changepage = function(mypage) {
          scope.page = mypage;
        };

        // only run this stuff of a modelname has been defined
        if(attrs.modelname) {
          scope.modelname = attrs.modelname;
          // initialize the api service which provides the model for the form by a http api

        }

        if(attrs.apihost) {
          this.apihost = attrs.apihost;
        }
      }
    };
  }
])
.directive('loadingContainer', function () {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var loadingLayer = angular.element('<div class="loading"></div>');
            element.append(loadingLayer);
            element.addClass('loading-container');
            scope.$watch(attrs.loadingContainer, function(value) {
                loadingLayer.toggleClass('ng-hide', !value);
            });
        }
    };
});
