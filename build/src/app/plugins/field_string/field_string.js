var formModule = angular.module('mlcl_forms.form');
var fieldStringText = function fieldStringText($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_string/field_string_text.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('string:text', [
  '$compile',
  '$templateCache',
  '$rootScope',
  fieldStringText
]);
formModule.factory('string', [
  '$compile',
  '$templateCache',
  '$rootScope',
  fieldStringText
]);