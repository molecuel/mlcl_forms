var mlcl_forms_widget = angular.module('mlcl_forms.widget').run([
    'widgetService',
    function (widgetService) {
      var structure = {
          type: 'video',
          target: 'content',
          data: { video: '' }
        };
      widgetService.registerWidget('video', structure);
    }
  ]).directive('widgetVideoEdit', function () {
    return {
      scope: {
        model: '=widgetmodel',
        tab: '@selecttab'
      },
      restrict: 'E',
      templateUrl: 'widget/video/edit.tpl.html',
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
  }).directive('widgetVideoView', [
    '$sce',
    function ($sce) {
      return {
        scope: { model: '=widgetmodel' },
        restrict: 'E',
        templateUrl: 'widget/video/view.tpl.html',
        link: function (scope) {
          if (scope.model.data.video) {
            scope.$watch('model.data.video', function (newVal) {
              scope.trustvideourl = $sce.trustAsResourceUrl(newVal);
            });
          }
        }
      };
    }
  ]);