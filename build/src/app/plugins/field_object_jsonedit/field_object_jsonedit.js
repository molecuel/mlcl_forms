var formModule = angular.module('mlcl_forms.form');
var fieldObjectJsonedit = function fieldStringText($compile, $templateCache, $rootScope, $filter) {
  return function (fieldScope) {
    var self = this;
    if (!fieldScope.model) {
      fieldScope.model = {};
    }
    fieldScope.$watch('model', function (json) {
      if (!json) {
        json = {};
      }
    }, true);
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_object_jsonedit/field_object_jsonedit.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('object:jsonedit', [
  '$compile',
  '$templateCache',
  '$rootScope',
  '$filter',
  fieldObjectJsonedit
]);