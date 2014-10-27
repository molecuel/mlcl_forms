var mlcl_forms = angular.module('mlcl_forms')
.directive('selectObjectid', ['$http', 'configService', function($http, configService) {
  return {
    scope: {
      model: '=widgetmodel',
      fieldinfo: '='
    },
    restrict: 'E',
    templateUrl: 'widgetDirectives/selectObjectid/selectObjectid.tpl.html',
    link: function(scope) {
      scope.$watch('selectedObject.selected', function(newVal) {
        if(newVal && newVal.id) {
          scope.model = newVal.id;
        }
      });

      scope.$watch('model', function(newVal) {
        if(newVal) {
          $http.get(
            configService.apiHost+'/api/search/'+scope.fieldinfo.ref + '/' +newVal
          ).then(function(response) {
            if(response.data && response.data.results) {
              scope.selectedObject.selected = response.data.results[0];
            }
            //scope.foundObjects = response.data.results;
          });
        }
      });

      scope.selectedObject = {};
      scope.refreshObjects = function(searchString) {
        var searchParam = {q: searchString};
        return $http.get(
          configService.apiHost+'/api/search/'+scope.fieldinfo.ref,
          {params: searchParam}
        ).then(function(response) {
          scope.foundObjects = response.data.results;
        });
      };
    }
  };
}]);
