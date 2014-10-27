var mlcl_forms_widget = angular.module('mlcl_forms.widget').run([
    'widgetService',
    function (widgetService) {
      var structure = {
          type: 'html',
          target: 'content',
          data: { html: '' }
        };
      widgetService.registerWidget('html', structure);
    }
  ]).directive('widgetHtmlEdit', function () {
    return {
      scope: {
        model: '=widgetmodel',
        tab: '@selecttab'
      },
      restrict: 'E',
      templateUrl: 'widget/html/edit.tpl.html',
      link: function (scope) {
        if (!scope.tab) {
          scope.tab = 'settings';
        }
        if (scope.tab == 'settings') {
          scope.settingsActive = true;
          scope.editorActive = false;
        } else if (scope.tab == 'editor') {
          scope.settingsActive = false;
          scope.editorActive = true;
        }
      }
    };
  }).directive('widgetHtmlView', function () {
    return {
      scope: { model: '=widgetmodel' },
      restrict: 'E',
      templateUrl: 'widget/html/view.tpl.html'
    };
  });