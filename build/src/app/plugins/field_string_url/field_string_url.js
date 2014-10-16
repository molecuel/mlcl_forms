var formModule = angular.module('mlcl_forms.form');
var fieldStringText = function fieldStringText($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_string_url/field_string_url.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('string:url', [
  '$compile',
  '$templateCache',
  '$rootScope',
  fieldStringText
]);