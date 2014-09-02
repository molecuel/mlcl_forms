var formModule = angular.module('mlcl_forms.form');
var fieldObjectFileFile = function fieldStringText($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_object_file_file/field_object_file_file.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('object:file:file', fieldObjectFileFile);