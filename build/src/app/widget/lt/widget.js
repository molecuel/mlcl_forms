var mlcl_forms_widget = angular.module('mlcl_forms.widget')
.run(function(widgetService) {
  var structure = {
    type: 'lt',
    target: 'content',
    _view: {
      template: ''
    },
    data: {
      name: ''
    }
  };
  widgetService.registerWidget('lt', structure);
})
.directive('widgetLtEdit', function() {
  return {
    scope: {
      model: '=widgetmodel',
      tab: '@selecttab'
    },
    restrict: 'E',
    templateUrl: 'widget/lt/edit.tpl.html',
    link: function(scope) {
      if(!scope.tab) {
        scope.tab = 'settings';
      }

      if(scope.tab == 'settings') {
        scope.settingsActive = true;
        scope.editorActive = false;
      } else if(scope.tab == 'editor') {
        scope.settingsActive = false;
        scope.editorActive = true;
      }
    }
  };
})
.directive('widgetLtView', function() {
  return {
    scope: {
      model: '=widgetmodel'
    },
    restrict: 'E',
    templateUrl: 'widget/lt/view.tpl.html'
  };
});
