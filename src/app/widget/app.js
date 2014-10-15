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
        if(_.isArray(scope.model)) {
          scope.model.push(widgetService.getItems(widgetname));
        }
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
        async.each(model, function(item, cb) {
          var subscope = scope.$new(false, scope);
          subscope.count = count;
          subscope.model = model[count];
          subscope.position = count;
          var widgetCont = $compile('<widget-'+item.type+'-view widgetmodel="model"></widget-'+ item.type+ '-view>{{model}}')(subscope);
          elem.append(widgetCont);
          count++;
          cb();
        }, function(err) {});
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

/**
 * Overwrite the init function of the flow module
 */
angular.module('flow.init', ['flow.provider'])
  .controller('flowCtrl', ['$scope', '$attrs', '$parse', 'flowFactory',
  function ($scope, $attrs, $parse, flowFactory) {
    // create the flow object
    var options = angular.extend({}, $scope.$eval($attrs.flowInit));
    var flow = flowFactory.create(options);

    flow.on('catchAll', function (eventName) {
      var args = Array.prototype.slice.call(arguments);
      args.shift();
      var event = $scope.$broadcast.apply($scope, ['flow::' + eventName, flow].concat(args));
      if ({
        'progress':1, 'filesSubmitted':1, 'fileSuccess': 1, 'fileError': 1, 'complete': 1
      }[eventName]) {
        $scope.$apply();
      }

      var event2 = $scope.$emit.apply($scope, ['flow::' + eventName, flow].concat(args));
      if ({
        'progress':1, 'filesSubmitted':1, 'fileSuccess': 1, 'fileError': 1, 'complete': 1
      }[eventName]) {
        $scope.$apply();
      }

      if (event.defaultPrevented && event2.defaultPrevented) {
        return false;
      }
    });

    $scope.$flow = flow;
    if ($attrs.hasOwnProperty('flowName')) {
      $parse($attrs.flowName).assign($scope, flow);
      $scope.$on('$destroy', function () {
        $parse($attrs.flowName).assign($scope);
      });
    }
  }])
  // Add the flowInit directive and overwrite the scope
  // original: Create a new scope
  .directive('flowInit', [function() {
    return {
      controller: 'flowCtrl'
    };
  }]
);
