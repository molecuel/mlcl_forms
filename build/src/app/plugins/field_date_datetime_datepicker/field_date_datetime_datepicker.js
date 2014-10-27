var formModule = angular.module('mlcl_forms.form');
formModule.$inject = ['ui.bootstrap.datepicker'];
var fieldStringText = function fieldStringText($compile, $templateCache, $rootScope) {
  return function (fieldScope) {
    var self = this;
    this.render = function () {
      var inputHtml = $templateCache.get('plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html');
      self.htmlObject = $compile(inputHtml)(fieldScope);
      return this;
    };
  };
};
formModule.factory('date:datetime:datepicker', [
  '$compile',
  '$templateCache',
  '$rootScope',
  fieldStringText
]);