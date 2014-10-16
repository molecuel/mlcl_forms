var formModule = angular.module('mlcl_forms.form');
var fieldArrayFile = function fieldStringText($compile, $templateCache, $rootScope, $http, configService) {
  return function (fieldScope) {
    var self = this;
    fieldScope.selectedObject = {};
    fieldScope.addToSet = function addToSet() {
      var myarray = [];
      async.each(fieldScope.selectedObject.selected, function (selObj, cb) {
        if (selObj.id) {
          myarray.push(selObj.id);
        }
        cb();
      }, function (err) {
        fieldScope.model = _.union(fieldScope.model, myarray);
      });
    };
    fieldScope.removeFromSet = function removeFromSet(item) {
      if (item && item.id) {
        fieldScope.model = _.without(fieldScope.model, item.id);
      }
    };
    fieldScope.modelInfo = {};
    fieldScope.renderedData = [];
    fieldScope.$watch('model', function (newVal) {
      if (_.isArray(newVal) && newVal.length > 0) {
        async.each(newVal, function (modelid, cb) {
          if (!_.isObject(fieldScope.modelInfo[modelid])) {
            $http.get(configService.apiHost + '/api/search/' + fieldScope.fieldInfo.ref + '/' + modelid).then(function (response) {
              fieldScope.modelInfo[modelid] = response.data.results[0];
              cb();
            });
          } else {
            cb();
          }
        }, function () {
          if (!fieldScope.initialized) {
            fieldScope.initialized = true;
          }
          fieldScope.renderArray();
        });
      }
    });
    fieldScope.$watchCollection('renderedData', function (newVal) {
      if (fieldScope.initialized) {
        var newmod = [];
        _.each(fieldScope.renderedData, function (item) {
          newmod.push(item.id);
        });
        fieldScope.model = newmod;
      }
    });
    fieldScope.renderArray = function renderArray() {
      var newRender = [];
      _.each(fieldScope.model, function (item) {
        if (_.isObject(fieldScope.modelInfo[item])) {
          newRender.push(fieldScope.modelInfo[item]);
        }
      });
      fieldScope.renderedData = newRender;
    };
    this.render = function render() {
      var inputHtml = $templateCache.get('plugins/field_array_objectid/field_array_objectid.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('array:objectid', [
  '$compile',
  '$templateCache',
  '$rootScope',
  '$http',
  'configService',
  fieldArrayFile
]);