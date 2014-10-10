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

    if(!fieldScope.fileInfo) {
      fieldScope.fileInfo = {};
    }

    /**
     * removeFile - Remove the file from the model
     *
     * @param  {type} file description
     * @return {type}      description
     */
    fieldScope.remove = function remove(file) {
      fieldScope.model = null;
    };

    fieldScope.fullsize = 0;

    fieldScope.$watch('model', function(newVal) {
      if(newVal) {
        $http.get(fieldScope.fieldInfo.apiRoot+'/'+newVal).
        success(function(data, status, headers, config) {
          fieldScope.fileInfo[newVal] = data;
          _.each(fieldScope.fileInfo, function(fileitem) {
            fieldScope.fullsize = fieldScope.fullsize + fileitem.length;
          });
        }).
        error(function(data, status, headers, config) {
          fieldScope.fileInfo[newVal] = {
            name: 'Error while getting file data'
          };
        });
      } else {
        fieldScope.fullsize = 0;
      }
    });

    fieldScope.$on('flow::fileSuccess', function(event, flow, file, fileargs) {

      if(fileargs) {
        fileargs = JSON.parse(fileargs);
      }

      if(fileargs.file) {
        fieldScope.model = fileargs.file;
      }
    });

    /**
     * render - Render the html content and add the scope
     *
     * @return {type}  description
     */
    this.render = function render() {
      var inputHtml = $templateCache.get('plugins/field_objectid_file/field_objectid_file.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};

// publish the function as field type handler
formModule.factory('objectid:file', ['$compile', '$templateCache', '$rootScope' , '$http', fieldArrayFile]);

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
