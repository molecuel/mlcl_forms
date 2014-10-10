angular.module( 'mlcl_forms.widget', [
  // should later be provided by plugin textArea
  'ckeditor',
  'JSONedit',
  'ngMaterial',
  'ui.bootstrap'
])
.directive('widgetManager', function($modal, widgetService) {
  return {
    scope: {
      model: '=widgetmodel'
    },
    restrict: 'E',
    templateUrl: 'widget/widgetmanager.tpl.html',
    link: function(scope, element) {

      scope.showSelectWidget = function() {
        if(scope.showWidgetSelect) {
          scope.showWidgetSelect = false;
        } else {
          scope.showWidgetSelect = true;
        }
      };

      scope.addWidget = function(widgetname) {
        scope.model.push(widgetService.getItems(widgetname));

      };
    }
  };
})
.directive('widgetViewContainer',['$compile', '$materialDialog', function($compile, $materialDialog) {
  return {
    scope: {
      model: '=widgetmodel'
    },
    restrict: 'E',
    templateUrl: 'widget/widgetcontainer.tpl.html',
    link: function(scope, elem) {
      var myscope = scope;
      scope.edit = function(model, eScope) {
        var subscope = scope.$new(false, eScope);
        subscope.model = eScope.model;

        $materialDialog.show({
          template: '<material-dialog class="col-md-12"><widget-'+eScope.model.type+'-edit widgetmodel="model" selecttab="editor"></widget-'+ eScope.model.type+ '-edit></material-dialog>',
          scope: subscope
        });
      };

      scope.settings = function(model, eScope) {
        var subscope = scope.$new(false, eScope);
        subscope.model = eScope.model;

        $materialDialog.show({
          template: '<material-dialog class="col-md-12"><widget-'+eScope.model.type+'-edit widgetmodel="model" selecttab="settings"></widget-'+ eScope.model.type+ '-edit></material-dialog>',
          scope: subscope
        });
      };

      Array.prototype.move = function (old_index, new_index) {
          if (new_index >= this.length) {
              var k = new_index - this.length;
              while ((k--) + 1) {
                  this.push(undefined);
              }
          }
          this.splice(new_index, 0, this.splice(old_index, 1)[0]);
          return this; // for testing purposes
      };

      scope.moveDown = function(model) {
        var oldIndex = scope.model.indexOf(model);
        var newIndex = oldIndex + 1;
        if(model && newIndex >=0 && newIndex < scope.model.length) {
          scope.model.move(oldIndex, newIndex);
        }
      };

      scope.moveUp = function(model) {
        var oldIndex = scope.model.indexOf(model);
        var newIndex = oldIndex - 1;
        if(model && newIndex >=0 && newIndex < scope.model.length) {
          scope.model.move(oldIndex, newIndex);
        }
      };

      scope.remove = function(item) {
        var index = scope.model.indexOf(item);
        scope.model.splice(index, 1);
      };

      scope.$watchCollection('model', function(model) {
        elem.empty();
        var count = 0;
        _.each(model, function(item) {
          var subscope = scope.$new(false, scope);
          subscope.count = count;
          subscope.model = model[count];
          subscope.position = count;
          var widgetCont = $compile('<widget-'+item.type+'-view widgetmodel="model"></widget-'+ item.type+ '-view>{{model}}')(subscope);
          elem.append(widgetCont);
          count++;
        });
      });
    }
  };
}])
.factory('widgetService', function WidgetService($rootScope, $http) {
  var service =  {
    registerWidget: function(name, structure) {
      if(!this.widgets) {
        this.widgets = {};
      }
      this.widgets[name] = structure;
    },
    getItems: function(name) {
      if(name) {
        return this.widgets[name];
      } else {
        return this.widgets;
      }
    }
  };

  return service;
});
