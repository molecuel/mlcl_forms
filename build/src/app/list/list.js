mlcl_forms.form = angular.module('mlcl_forms.list', [
  'mlcl_forms',
  'mlcl_forms.services',
  'ui.bootstrap'
]).directive('mlclFormList', [
  '$compile',
  '$injector',
  '$rootScope',
  '$filter',
  '$templateCache',
  'apiService',
  'growl',
  function ($compile, $injector, $rootScope, $filter, $templateCache, ApiService, growl) {
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
        scope.$watch('pages', function (newVal) {
          var pagearray = [];
          var i = 1;
          while (i <= scope.pages) {
            pagearray.push(i);
            i++;
          }
          scope.pagearray = pagearray;
        });
        scope.$watch('page', function (newVal) {
          api.listCollection(scope.page, function (err, result) {
            if (result) {
              scope.listfields = result.listFields;
              scope.elements = result.hits;
              scope.pages = result.pages;
            }
          });
        });
        scope.changepage = function (mypage) {
          scope.page = mypage;
        };
        if (attrs.modelname) {
          var api = new ApiService(scope, attrs.modelname, attrs.apihost);
          scope.api = api;
          api.listCollection(scope.page, function (err, result) {
            if (result) {
              scope.listfields = result.listFields;
              scope.elements = result.hits;
              scope.pages = result.pages;
            }
          });
        }
        if (attrs.apihost) {
          this.apihost = attrs.apihost;
        }
      }
    };
  }
]);