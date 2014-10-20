var formModule = angular.module('mlcl_forms.form');
var field = function field($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_string_select/field_string_select.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('string:select', [
  '$compile',
  '$templateCache',
  '$rootScope',
  field
]);