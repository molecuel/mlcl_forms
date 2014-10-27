var mlcl_forms_widget = angular.module('mlcl_forms.widget')
.run(function(widgetService) {
  var structure = {
    type: 'collection',
    target: 'content',
    _view: {
      template: ''
    },
    data: {
      name: '',
      params: {
        index: ''
      }
    }
  };
  widgetService.registerWidget('collection', structure);
})
.directive('widgetCollectionEdit', function() {
  return {
    scope: {
      model: '=widgetmodel',
      tab: '@selecttab'
    },
    restrict: 'E',
    templateUrl: 'widget/collection/edit.tpl.html',
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
.directive('widgetCollectionView', function() {
  return {
    scope: {
      model: '=widgetmodel'
    },
    restrict: 'E',
    templateUrl: 'widget/collection/view.tpl.html'
  };
});
