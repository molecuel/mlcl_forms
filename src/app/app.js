var mlcl_forms = angular.module('mlcl_forms', [
  'mlcl_forms-templates-app',
  'mlcl_forms-templates-common',
  'ui.bootstrap',
  'mlcl_forms.form',
  'mlcl_forms.list',
  'angular-growl',
  'ngSanitize',
  'ngAnimate',
  'ngMaterial'
])
.controller('BaseCtrl', ['$scope','$http', '$filter', '$modal', '$window', 'growl',
  function ($scope, $http, $filter, $modal, $window, growl) {

  }
])
.controller('SaveChangesModalCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  $scope.yes = function () {
    $modalInstance.close(true);
  };
  $scope.no = function () {
    $modalInstance.close(false);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
.filter('titleCase', [function () {
  return function (str, stripSpaces) {
    if(str) {
      var value = str
        .replace(/(_|\.)/g, ' ')                       // replace underscores and dots with spaces
        .replace(/[A-Z]/g, ' $&').trim()               // precede replace caps with a space
        .replace(/\w\S*/g, function (txt) {            // capitalise first letter of word
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      if (stripSpaces) {
        value = value.replace(/\s/g, '');
      } else {
        // lose double spaces
        value = value.replace(/\s{2,}/g, ' ');
      }
      return value;
    } else {
      return '';
    }
  };
}]);
