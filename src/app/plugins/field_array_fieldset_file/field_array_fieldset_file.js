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
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope) {
  return function(fieldScope) {
    var self = this;

    // Make fieldinfo accessible via a local variable
    var fieldinfo = fieldScope.fieldInfo;

    // check if the fieldinformations can be discovered via the api
    // create the upload path for the widget
    if(fieldScope.fieldInfo && !fieldScope.fieldInfo.uploadPath) {
      if(fieldScope.$parent.attrs.apihost) {
        fieldScope.fieldInfo.uploadPath = fieldScope.$parent.attrs.apihost + '/file/upload';
      } else {
        fieldScope.fieldInfo.uploadPath = '/file/upload';
      }
    }

    // check if there is already a array
    if(!fieldScope.model) {
      fieldScope.model = [];
    }

    fieldScope.$on('flow::fileSuccess', function(event, flow, file, fileargs) {

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
          schema[reffield] = filargs.file;
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
     * removeFile - Remove the file from the model
     *
     * @param  {type} file description
     * @return {type}      description
     */
    fieldScope.removeFile = function removeFile(file) {
      file.cancel();
    };


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
formModule.factory('array:fieldset:file', fieldArrayFile);

/**
 * Overwrite the init function of the flow module
 */
angular.module('flow.init', ['flow.provider'])
  .controller('flowCtrl', ['$scope', '$attrs', '$parse', 'flowFactory',
  function ($scope, $attrs, $parse, flowFactory) {
    // create the flow object
    var options = angular.extend({}, $scope.$eval($attrs.flowInit));
    var flow = flowFactory.create(options);

    flow.on('catchAll', function (eventName) {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      var event = $scope.$broadcast.apply($scope, ['flow::' + eventName, flow].concat(args));
      if ({
        'progress':1, 'filesSubmitted':1, 'fileSuccess': 1, 'fileError': 1, 'complete': 1
      }[eventName]) {
        $scope.$apply();
      }

      if (event.defaultPrevented) {
        return false;
      }
    });

    $scope.$flow = flow;
    if ($attrs.hasOwnProperty('flowName')) {
      $parse($attrs.flowName).assign($scope, flow);
      $scope.$on('$destroy', function () {
        $parse($attrs.flowName).assign($scope);
      });
    }
  }])
  // Add the flowInit directive and overwrite the scope
  // original: Create a new scope
  .directive('flowInit', [function() {
    return {
      controller: 'flowCtrl'
    };
  }]
);
