/**
 * Extend the form module to be able to output text input fields
 */

var formModule = angular.module('mlcl_forms.form');

formModule.factory('string:text', function($compile, $templateCache, $rootScope) {
  return function(fieldScope) {
    var self = this;

    this.render = function() {
      var inputHtml = $templateCache.get('plugins/field_input/field_input_text.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
});
