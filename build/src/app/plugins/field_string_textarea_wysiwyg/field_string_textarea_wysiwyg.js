var formModule = angular.module('mlcl_forms.form');
var fieldStringTextArea = function fieldStringText($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_string_textarea_wysiwyg/field_string_textarea_wysiwyg.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('string:textarea:wysiwyg', fieldStringTextArea);