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
var fieldObjectJsonedit = function fieldStringText($compile, $templateCache, $rootScope, $filter, $materialDialog) {
  return function(fieldScope) {
    var self = this;

    if(!fieldScope.model) {
      fieldScope.model ={};
    }

    fieldScope.$watch('model', function(json) {
      if(!json) {
        json = {};
      }
      //fieldScope.jsonString = $filter('json')(json);
    }, true);

    fieldScope.$dialog = function(e){
      $materialDialog.show({
        template: '</head><material-dialog><div class="dialog-content"><h1> test</h1><material-button ng-click="close">Close</material-button></div></material-dialog>',
        targetEvent: e,
        controller: ['$scope', function($scope) {
          fieldScope.close = function() {
            $materialDialog.hide();
          };
        }]
      });
    };

    this.render = function() {
      var inputHtml = $templateCache.get('plugins/field_object_jsonedit/field_object_jsonedit.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

formModule.factory('object:jsonedit', ['$compile', '$templateCache', '$rootScope', '$filter', '$materialDialog', fieldObjectJsonedit]);
