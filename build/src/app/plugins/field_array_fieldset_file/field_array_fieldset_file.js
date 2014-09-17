var formModule = angular.module('mlcl_forms.form');
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    var fieldinfo = fieldScope.fieldInfo;
    if (fieldScope.fieldInfo && !fieldScope.fieldInfo.uploadPath) {
      if (fieldScope.$parent.attrs.apihost) {
        fieldScope.fieldInfo.uploadPath = fieldScope.$parent.attrs.apihost + '/file/upload';
      } else {
        fieldScope.fieldInfo.uploadPath = '/file/upload';
      }
    }
    if (!fieldScope.model) {
      fieldScope.model = [];
    }
    fieldScope.$on('flow::fileSuccess', function (event, flow, file, fileargs) {
      var reffield = 'file';
      if (fieldinfo.schema) {
        if (fieldinfo.options.filereffield) {
          reffield = fieldinfo.options.filerefffield;
        }
        var schema = {};
        if (fileargs.file) {
          schema[reffield] = filargs.file;
        }
        var foundItem = _.find(fieldScope.model, function (item) {
            return item[reffield] == fileargs.file;
          });
        if (!foundItem && fileargs.file) {
          fieldScope.model.push(schema);
          fieldScope.fileIndex = _.indexBy(fieldScope.model, reffield);
        }
      }
    });
    fieldScope.removeFile = function removeFile(file) {
      file.cancel();
    };
    this.render = function render() {
      var inputHtml = $templateCache.get('plugins/field_array_fieldset_file/field_array_fieldset_file.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('array:fieldset:file', [
  '$compile',
  '$templateCache',
  '$rootScope',
  fieldArrayFile
]);
angular.module('flow.init', ['flow.provider']).controller('flowCtrl', [
  '$scope',
  '$attrs',
  '$parse',
  'flowFactory',
  function ($scope, $attrs, $parse, flowFactory) {
    var options = angular.extend({}, $scope.$eval($attrs.flowInit));
    var flow = flowFactory.create(options);
    flow.on('catchAll', function (eventName) {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      var event = $scope.$broadcast.apply($scope, [
          'flow::' + eventName,
          flow
        ].concat(args));
      if ({
          'progress': 1,
          'filesSubmitted': 1,
          'fileSuccess': 1,
          'fileError': 1,
          'complete': 1
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
  }
]).directive('flowInit', [function () {
    return { controller: 'flowCtrl' };
  }]);