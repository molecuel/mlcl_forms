var formModule = angular.module('mlcl_forms.form');
var fieldStringText = function fieldStringText($compile, $templateCache, $rootScope, configService) {
  return function (fieldScope) {
    var self = this;
    fieldScope.$watch('model', function (val) {
      fieldScope.defaultTZ = configService.defaultTimezone;
      if (typeof val !== 'Date') {
        fieldScope.model = new Date(val);
      }
    });
    this.render = function () {
      var inputHtml;
      if (fieldScope.fieldInfo.readonly) {
        inputHtml = $templateCache.get('plugins/field_date/field_date_readonly.tpl.html');
      } else {
        inputHtml = $templateCache.get('plugins/field_date/field_date.tpl.html');
      }
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('date:datetime', [
  '$compile',
  '$templateCache',
  '$rootScope',
  'configService',
  fieldStringText
]);
formModule.factory('date', [
  '$compile',
  '$templateCache',
  '$rootScope',
  'configService',
  fieldStringText
]);