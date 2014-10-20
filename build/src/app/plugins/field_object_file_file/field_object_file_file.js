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
var fieldObjectFileFile = function fieldStringText($compile, $templateCache, $rootScope) {
  return function(fieldScope) {
    var self = this;
    if(fieldScope.fieldInfo && !fieldScope.fieldInfo.uploadPath) {
      if(fieldScope.$parent.attrs.apihost) {
        fieldScope.fieldInfo.uploadPath = fieldScope.$parent.attrs.apihost + '/file/upload';
      } else {
        fieldScope.fieldInfo.uploadPath = '/file/upload';
      }
    }

    fieldScope.$watchCollection('flow.files', function(newVal) {
      fieldScope.model = newVal;
    });

    this.render = function() {
      var inputHtml = $templateCache.get('plugins/field_object_file_file/field_object_file_file.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

formModule.factory('object:file:file', ['$compile', '$templateCache', '$rootScope', fieldObjectFileFile]);
