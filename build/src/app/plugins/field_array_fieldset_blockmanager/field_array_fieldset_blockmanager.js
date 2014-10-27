var formModule = angular.module('mlcl_forms.form');
var fieldObjectJsonedit = function fieldStringText($compile, $templateCache, $rootScope, $filter) {
  return function (fieldScope) {
    var self = this;
    if (!fieldScope.model) {
      fieldScope.model = [];
    }
    fieldScope.$watch('model', function (json) {
      if (!json) {
        json = {};
      }
    }, true);
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_array_fieldset_blockmanager/field_array_fieldset_blockmanager.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('array:fieldset:blockmanager', [
  '$compile',
  '$templateCache',
  '$rootScope',
  '$filter',
  fieldObjectJsonedit
]);
formModule.factory('array:object:blockmanager', [
  '$compile',
  '$templateCache',
  '$rootScope',
  '$filter',
  fieldObjectJsonedit
]);