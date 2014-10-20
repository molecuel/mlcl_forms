var formModule = angular.module('mlcl_forms.form');
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope, $http) {
  return function (fieldScope) {
    var self = this;
    var fieldinfo = fieldScope.fieldInfo;
    var apiRootPath = '/api/file';
    fieldScope.fieldInfo.apiRoot = apiRootPath;
    if (fieldScope.$parent.attrs.apihost) {
      fieldScope.fieldInfo.apihost = fieldScope.$parent.attrs.apihost;
    }
    if (fieldScope.$parent.attrs.apihost && !fieldScope.fieldInfo.apiroot) {
      fieldScope.fieldInfo.apiRoot = fieldScope.$parent.attrs.apihost + apiRootPath;
    }
    fieldScope.fieldInfo.uploadPath = fieldScope.fieldInfo.apiRoot + '/upload';
    if (!fieldScope.model) {
      fieldScope.model = [];
    }
    fieldScope.remove = function remove(file) {
      _.each(fieldScope.model, function (item) {
        if (item.file === file.file) {
          fieldScope.model = _.without(fieldScope.model, _.findWhere(fieldScope.model, { file: item.file }));
        }
      });
    };
    fieldScope.fullsize = 0;
    fieldScope.$watchCollection('model', function (newVal) {
      if (!fieldScope.fileInfo) {
        fieldScope.fileInfo = {};
      }
      _.each(fieldScope.model, function (item) {
        if (item.file) {
          $http.get(fieldScope.fieldInfo.apiRoot + '/' + item.file).success(function (data, status, headers, config) {
            fieldScope.fileInfo[item.file] = data;
            _.each(fieldScope.fileInfo, function (fileitem) {
              fieldScope.fullsize = fieldScope.fullsize + fileitem.length;
            });
          }).error(function (data, status, headers, config) {
            fieldScope.fileInfo[item.file] = { name: 'Error while getting file data' };
          });
        }
      });
    });
    fieldScope.$on('flow::fileSuccess', function (event, flow, file, fileargs) {
      if (fileargs) {
        fileargs = JSON.parse(fileargs);
      }
      var reffield = 'file';
      if (fieldinfo.schema) {
        if (fieldinfo.options.filereffield) {
          reffield = fieldinfo.options.filerefffield;
        }
        var schema = {};
        if (fileargs.file) {
          schema[reffield] = fileargs.file;
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
  '$http',
  fieldArrayFile
]);