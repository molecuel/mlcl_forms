var mlcl_forms = angular.module('mlcl_forms')
.directive('selectObjectids', ['$http', 'configService', function($http, configService) {
  return {
    scope: {
      model: '=widgetmodel',
      fieldinfo: '=',
      selected: "="
    },
    restrict: 'E',
    templateUrl: 'widgetDirectives/selectObjectids/selectObjectid.tpl.html',
    link: function(scope) {

      if(scope.selected) {
        scope.selected = {};
      }
      scope.foundObjects = [];

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
