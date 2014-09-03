/**
 * Extend the form module to be able to output text input fields
 */

var formModule = angular.module('mlcl_forms.form');



/**
 * fieldStringText - Function for string text rendering
 *
 * @param  {function} $compile       compile function
 * @param  {function} $templateCache angular templatecache
 * @param  {function} $rootScope     description
 * @return {type}                description
 */
var fieldStringText = function fieldStringText($compile, $templateCache, $rootScope) {
  return function(fieldScope) {
    var self = this;

    this.render = function() {
      var inputHtml = $templateCache.get('plugins/field_boolean/field_boolean.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

formModule.factory('boolean', fieldStringText);
