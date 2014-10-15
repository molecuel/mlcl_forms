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
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope, $http) {
  return function(fieldScope) {
    var self = this;

    // Make fieldinfo accessible via a local variable
    var fieldinfo = fieldScope.fieldInfo;

    var apiRootPath = '/api/file';
    fieldScope.fieldInfo.apiRoot = apiRootPath;

    if(fieldScope.$parent.attrs.apihost) {
      fieldScope.fieldInfo.apihost = fieldScope.$parent.attrs.apihost;
    }

    if(fieldScope.$parent.attrs.apihost && !fieldScope.fieldInfo.apiroot) {
      fieldScope.fieldInfo.apiRoot = fieldScope.$parent.attrs.apihost + apiRootPath;
    }

    fieldScope.fieldInfo.uploadPath = fieldScope.fieldInfo.apiRoot + '/upload';

    // check if there is already a array
    if(!fieldScope.model) {
      fieldScope.model = [];
    }

    /**
     * removeFile - Remove the file from the model
     *
     * @param  {type} file description
     * @return {type}      description
     */
    fieldScope.remove = function remove(file) {
      _.each(fieldScope.model, function(item) {
        if(item.file === file.file) {
          fieldScope.model = _.without(fieldScope.model, _.findWhere(fieldScope.model, {file: item.file}));
        }
      });
    };

    fieldScope.fullsize = 0;

    fieldScope.$watchCollection('model', function(newVal) {
      if(!fieldScope.fileInfo) {
        fieldScope.fileInfo = {};
      }
      _.each(fieldScope.model, function(item) {
        if(item.file) {
        $http.get(fieldScope.fieldInfo.apiRoot+'/'+item.file).
        success(function(data, status, headers, config) {
          fieldScope.fileInfo[item.file] = data;
          _.each(fieldScope.fileInfo, function(fileitem) {
            fieldScope.fullsize = fieldScope.fullsize + fileitem.length;
          });
        }).
        error(function(data, status, headers, config) {
          fieldScope.fileInfo[item.file] = {
            name: 'Error while getting file data'
          };
        });
        }
      });
    });

    fieldScope.$on('flow::fileSuccess', function(event, flow, file, fileargs) {

      if(fileargs) {
        fileargs = JSON.parse(fileargs);
      }
      var reffield = 'file';
      // there is a subschema
      if(fieldinfo.schema) {
        // check if there is another field specified as file ref field
        // if not default
        if(fieldinfo.options.filereffield) {
          reffield = fieldinfo.options.filerefffield;
        }

        // create a object for the file
        var schema = {};

        // check if a file id has been found
        if(fileargs.file) {
          schema[reffield] = fileargs.file;
        }

        // check if the item is already in the model
        var foundItem = _.find(fieldScope.model, function(item) {
          return item[reffield] == fileargs.file;
        });

        // if the object is not yet in the model scope, add it and create the index
        if(!foundItem && fileargs.file) {
          // push the found item to the model
          fieldScope.model.push(schema);
          // create a file index based on the id of the file
          fieldScope.fileIndex = _.indexBy(fieldScope.model, reffield);
        }
      }
    });

    /**
     * render - Render the html content and add the scope
     *
     * @return {type}  description
     */
    this.render = function render() {
      var inputHtml = $templateCache.get('plugins/field_array_fieldset_file/field_array_fieldset_file.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

// publish the function as field type handler
formModule.factory('array:fieldset:file', ['$compile', '$templateCache', '$rootScope' , '$http', fieldArrayFile]);
