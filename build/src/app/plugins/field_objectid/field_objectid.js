var formModule = angular.module('mlcl_forms.form');
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope, $http, configService) {
  return function (fieldScope) {
    var self = this;
    fieldScope.$watch('selectedObject.selected', function (newVal) {
      if (newVal && newVal.id) {
        fieldScope.model = newVal.id;
      }
    });
    fieldScope.$watch('model', function (newVal) {
      if (newVal) {
        $http.get(configService.apiHost + '/api/search/' + fieldScope.fieldInfo.ref + '/' + newVal).then(function (response) {
          if (response.data && response.data.results) {
            fieldScope.selectedObject.selected = response.data.results[0];
          }
        });
      }
    });
    fieldScope.selectedObject = {};
    fieldScope.refreshObjects = function (searchString) {
      var searchParam = { q: searchString };
      return $http.get(configService.apiHost + '/api/search/' + fieldScope.fieldInfo.ref, { params: searchParam }).then(function (response) {
        fieldScope.foundObjects = response.data.results;
      });
    };
    this.render = function render() {
      var inputHtml = $templateCache.get('plugins/field_objectid/field_objectid.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('objectid', [
  '$compile',
  '$templateCache',
  '$rootScope',
  '$http',
  'configService',
  fieldArrayFile
]);