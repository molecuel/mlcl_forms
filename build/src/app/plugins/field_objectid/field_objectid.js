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
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope, $http, configService) {
  return function(fieldScope) {
    var self = this;

    fieldScope.$watch('selectedObject.selected', function(newVal) {
      if(newVal && newVal.id) {
        fieldScope.model = newVal.id;
      }
    });

    fieldScope.$watch('model', function(newVal) {
      if(newVal) {
        $http.get(
          configService.apiHost+'/api/search/'+fieldScope.fieldInfo.ref + '/' +newVal
        ).then(function(response) {
          if(response.data && response.data.results) {
            fieldScope.selectedObject.selected = response.data.results[0];
          }
          //fieldScope.foundObjects = response.data.results;
        });
      }
    });

    fieldScope.selectedObject = {};
    fieldScope.refreshObjects = function(searchString) {
      var searchParam = {q: searchString};
      return $http.get(
        configService.apiHost+'/api/search/'+fieldScope.fieldInfo.ref,
        {params: searchParam}
      ).then(function(response) {
        fieldScope.foundObjects = response.data.results;
      });
    };
    /**
     * render - Render the html content and add the scope
     *
     * @return {type}  description
     */
    this.render = function render() {
      var inputHtml = $templateCache.get('plugins/field_objectid/field_objectid.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

// publish the function as field type handler
formModule.factory('objectid', ['$compile', '$templateCache', '$rootScope', '$http', 'configService', fieldArrayFile]);
