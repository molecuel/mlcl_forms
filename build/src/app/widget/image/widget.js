var mlcl_forms_widget = angular.module('mlcl_forms.widget')
.run(function(widgetService) {
  var structure = {
    type: 'image',
    target: 'content',
    data: {
      images:[],
      settings: {
        gallery: false
      }
    }
  };
  widgetService.registerWidget('image', structure);
})
.directive('widgetImageEdit', ['configService', '$http', function(configService, $http) {
  return {
    scope: {
      model: '=widgetmodel',
      tab: '@selecttab'
    },
    restrict: 'E',
    templateUrl: 'widget/image/edit.tpl.html',
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
      var self = this;

      // Make fieldinfo accessible via a local variable
      var fieldinfo = scope.fieldInfo;

      if(!scope.apiRoot) {
        scope.apiRoot = '/api/file';
      }

      if(configService.apiHost) {
        scope.apiRoot = configService.apiHost + '' + scope.apiRoot;
      }

      scope.uploadPath = scope.apiRoot + '/upload';

      /**
       * removeFile - Remove the file from the model
       *
       * @param  {type} file description
       * @return {type}      description
       */
      scope.remove = function remove(file) {
        _.each(scope.model.data.images, function(item) {
          if(item.file === file.file) {
            scope.model.data.images = _.without(scope.model.data.images, _.findWhere(scope.model.data.images, {file: item.file}));
          }
        });
      };

      scope.fullsize = 0;

      scope.$watchCollection('model.data.images', function(newVal) {
        if(!scope.fileInfo) {
          scope.fileInfo = {};
        }
        _.each(scope.model.data.images, function(item) {
          if(item.file) {
            $http.get(scope.apiRoot+'/'+item.file).
            success(function(data, status, headers, config) {
              scope.fileInfo[item.file] = data;
              _.each(scope.fileInfo, function(fileitem) {
                scope.fullsize = scope.fullsize + fileitem.length;
              });
            }).
            error(function(data, status, headers, config) {
              scope.fileInfo[item.file] = {
                name: 'Error while getting file data'
              };
            });
          }
        });
      });

      scope.$on('flow::fileSuccess', function(event, flow, file, fileargs) {
        if(fileargs) {
          fileargs = JSON.parse(fileargs);
        }
        var reffield = 'file';

        // create a object for the file
        var schema = {};

        // check if a file id has been found
        if(fileargs.file) {
          schema['file'] = fileargs.file;
        }

        // check if the item is already in the model
        var foundItem = _.find(scope.model.data.images, function(item) {
          return item['file'] == fileargs.file;
        });

        // if the object is not yet in the model scope, add it and create the index
        if(!foundItem && fileargs.file) {
          // push the found item to the model
          scope.model.data.images.push(schema);
          // create a file index based on the id of the file
          scope.fileIndex = _.indexBy(scope.model.data.images, reffield);
        }
      });
    }
  };
}])
.directive('widgetImageView', ['configService', '$http', function(configService, $http) {
  return {
    scope: {
      model: '=widgetmodel'
    },
    restrict: 'E',
    templateUrl: 'widget/image/view.tpl.html',
    link: function(scope) {
      if(!scope.apiRoot) {
        scope.apiRoot = '/api/file';
      }

      scope.apiHost = configService.apiHost;

      if(configService.apiHost) {
        scope.apiRoot = configService.apiHost + '' + scope.apiRoot;
      }

      scope.uploadPath = scope.apiRoot + '/upload';

      scope.$watchCollection('model.data.images', function(newVal) {
        if(!scope.fileInfo) {
          scope.fileInfo = {};
        }

        if(newVal[0] && newVal[0].file) {
          scope.firstimage = newVal[0].file;
        } else {
          scope.firstimage = null;
        }

        async.each(scope.model.data.images, function(item, cb) {
          if(item.file) {
            $http.get(scope.apiRoot+'/'+item.file).
            success(function(data, status, headers, config) {
              scope.fileInfo[item.file] = data;
              _.each(scope.fileInfo, function(fileitem) {
                scope.fullsize = scope.fullsize + fileitem.length;
              });
              cb();
            }).
            error(function(data, status, headers, config) {
              scope.fileInfo[item.file] = {
                name: 'Error while getting file data'
              };
              cb();
            });
          }
        }, function(err) {

        });
      });
    }
  };
}]);
