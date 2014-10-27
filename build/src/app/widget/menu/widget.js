var mlcl_forms_widget = angular.module('mlcl_forms.widget').run([
    'widgetService',
    function (widgetService) {
      var structure = {
          type: 'menu',
          target: 'content',
          _view: { template: '' },
          data: { name: '' }
        };
      widgetService.registerWidget('menu', structure);
    }
  ]).directive('widgetMenuEdit', function () {
    return {
      scope: {
        model: '=widgetmodel',
        tab: '@selecttab'
      },
      restrict: 'E',
      templateUrl: 'widget/menu/edit.tpl.html',
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
  }).directive('widgetMenuView', function () {
    return {
      scope: { model: '=widgetmodel' },
      restrict: 'E',
      templateUrl: 'widget/menu/view.tpl.html'
    };
  });