/**
 * Extend the form module to be able to output text input fields
 */

var formModule = angular.module('mlcl_forms.form');


/**
 * field - description
 *
 * @param  {type} $compile       description
 * @param  {type} $templateCache description
 * @param  {type} $rootScope     description
 * @return {type}                description
 */
var field = function field($compile, $templateCache, $rootScope) {
  return function(fieldScope) {
    var self = this;

    this.render = function() {
      var inputHtml = $templateCache.get('plugins/field_string_select/field_string_select.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

formModule.factory('string:select', field);
