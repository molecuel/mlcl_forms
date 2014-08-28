var mlcl_forms_services = angular.module('mlcl_forms.services', []);

mlcl_forms_services.factory('apiService', ['$http', 'schemaService', function($http, SchemaService) {

  return function(modelName, apiHost) {

    var self = this;
    this.modelName = modelName;
    this.apiHost = apiHost;
    this.schemaService = new SchemaService(modelName);


    /**
     * getSchema - Get the schema via API
     *
     * @param  {type} callback description
     * @return {type}          description
     */
    this.getSchema = function getSchema(callback) {
      if(!self.apiHost) {
        self.apiHost ='';
      }
      $http.get( self.apiHost + '/api/schema/' + self.modelName, {cache: true}).success(function (data) {
        if(data) {
          var schema = self.schemaService.handleFormSchema(data, true, '');
          callback(schema);
        }
      });
    };

    this.getRecord = function getRecord(callback) {
      $http.get( $scope.apiHost + '/api/' + $scope.modelName + '/' + $scope.id).success(function (data) {
        if (data.success === false) {
          console.log('err');
        }
        allowLocationChange = false;
        $scope.phase = 'reading';
        if (typeof $scope.dataEventFunctions.onAfterRead === 'function') {
          $scope.dataEventFunctions.onAfterRead(data);
        }
        $scope.processServerData(data);
      }).error(function () {
        console.log('err');
      });
    };
  };
}]);

/**
 * schema handling factory
 */
mlcl_forms_services.factory('schemaService', function() {

  return function(modelName) {
    var self = this;
    this.modelName = modelName;

    /**
     * handleSchema - Handle the schema returned by the API
     *
     * @param  {type} source      description
     * @param  {type} doRecursion description
     * @param  {type} prefix      description
     * @return {type}             description
     */
    this.handleFormSchema = function handleSchema(source, doRecursion, prefix) {
      if(!prefix) {
        prefix = '';
      }
      var destForm = [];
      // Iterate over the fields
      for (var field in source) {
        // check for subobjects
        if (field !== '_id' && source.hasOwnProperty(field)) {
          var mongooseType = source[field],
            mongooseOptions = mongooseType.options || {};
          var formData = mongooseOptions.form || {};
          if (!formData.hidden) {
            if (mongooseType.schema) {
              if (doRecursion && destForm) {
                var schemaSchema = self.handleSchema(mongooseType.schema, true,field + '.');
                var sectionInstructions = self.basicInstructions(field, formData, prefix);
                sectionInstructions.schema = schemaSchema;
                // tab function currently removed
                //if (formData.tab) { handletabInfo(formData.tab, sectionInstructions); }
                if (formData.order !== undefined) {
                  destForm.splice(formData.order, 0, sectionInstructions);
                } else {
                  destForm.push(sectionInstructions);
                }
              }
            } else {
              var formInstructions = self.basicInstructions(field, formData, prefix);
              //@todo: if (handleConditionals(formInstructions.showIf, formInstructions.name) && field !== 'options') {
              //@todo: check if needed
              if(field !== 'options') {
                var formInst = self.handleFieldType(formInstructions, mongooseType, mongooseOptions);
                // tab function currently removed
                //if (formInst.tab) { handletabInfo(formInst.tab, formInst); }
                if (formData.order !== undefined) {
                  destForm.splice(formData.order, 0, formInst);
                } else {
                  destForm.push(formInst);
                }
              } // end if(field !== 'options')
            } // end else
          }
        } // end form data hidden
      } // end for
      return destForm;
    };


    /**
     * basicInstructions - returns the name with prefix
     *
     * @param  {type} field    description
     * @param  {type} formData description
     * @param  {type} prefix   description
     * @return {Array}         formData
     */
    this.basicInstructions = function basicInstructions(field, formData, prefix) {
      formData.name = prefix + field;
      return formData;
    };


    /**
     * handleFieldType - description
     *
     * @param  {type} formInstructions description
     * @param  {type} mongooseType     description
     * @param  {type} mongooseOptions  description
     * @return {type}                  description
     */
    this.handleFieldType = function handleFieldType(formInstructions, mongooseType, mongooseOptions) {

        var select2ajaxName;
        if (mongooseType.caster) {
          formInstructions.array = true;
          mongooseType = mongooseType.caster;
          angular.extend(mongooseOptions, mongooseType.options);
        }
        formInstructions.instance = mongooseType.instance.toLowerCase();
        if (mongooseType.instance === 'String') {
          /*if (mongooseOptions.enum) {
            formInstructions.type = formInstructions.type || 'select';
            // Hacky way to get required styling working on select controls
            if (mongooseOptions.required) {
              $scope.$watch('record.' + formInstructions.name, function (newValue) {
                updateInvalidClasses(newValue, formInstructions.id, formInstructions.select2);
              }, true);
              setTimeout(function () {
                updateInvalidClasses($scope.record[formInstructions.name], formInstructions.id, formInstructions.select2);
              }, 0);
            }
            if (formInstructions.select2) {
              $scope['select2' + formInstructions.name] = {
                allowClear: !mongooseOptions.required,
                initSelection: function (element, callback) {
                  callback(element.select2('data'));
                },
                query: function (query) {
                  var data = {results: []},
                    searchString = query.term.toUpperCase();
                  for (var i = 0; i < mongooseOptions.enum.length; i++) {
                    if (mongooseOptions.enum[i].toUpperCase().indexOf(searchString) !== -1) {
                      data.results.push({id: i, text: mongooseOptions.enum[i]});
                    }
                  }
                  query.callback(data);
                }
              };
              _.extend($scope['select2' + formInstructions.name], formInstructions.select2);
              formInstructions.select2.s2query = 'select2' + formInstructions.name;
              $scope.select2List.push(formInstructions.name);
            } else {
              formInstructions.options = suffixCleanId(formInstructions, 'Options');
              $scope[formInstructions.options] = mongooseOptions.enum;
            }
          } else {*/
          if (!formInstructions.type) {
            formInstructions.type = (formInstructions.name.toLowerCase().indexOf('password') !== -1) ? 'password' : 'text';
          }
          if (mongooseOptions.match) {
            formInstructions.add = 'pattern="' + mongooseOptions.match + '" ' + (formInstructions.add || '');
          }
          //}
        } else if (mongooseType.instance === 'ObjectID') {
          formInstructions.ref = mongooseOptions.ref;
          if (formInstructions.link && formInstructions.link.linkOnly) {
            formInstructions.type = 'link';
            formInstructions.linkText = formInstructions.link.text;
            formInstructions.form = formInstructions.link.form;
            delete formInstructions.link;
          }
        } else if (mongooseType.instance === 'Date') {
          if (!formInstructions.type) {
            if (formInstructions.readonly) {
              formInstructions.type = 'text';
            } else {
              formInstructions.type = 'datetime';
            }
          }
        } else if (mongooseType.instance === 'boolean') {
          formInstructions.type = 'checkbox';
        } else if (mongooseType.instance === 'Number') {
          formInstructions.type = 'number';
          formInstructions.max = mongooseOptions.max;
          formInstructions.min = mongooseOptions.min;
          formInstructions.step = mongooseOptions.step;

          //@deprecated
          if (mongooseOptions.min) {
            formInstructions.add = 'min="' + mongooseOptions.min + '" ' + (formInstructions.add || '');
          }
          if (mongooseOptions.max) {
            formInstructions.add = 'max="' + mongooseOptions.max + '" ' + (formInstructions.add || '');
          }
          if (formInstructions.step) {
            formInstructions.add = 'step="' + formInstructions.step + '" ' + (formInstructions.add || '');
          }
        } else if (mongooseType.instance === 'file') {
          formInstructions.type = 'fileuploader';
        } else if (mongooseOptions.form && mongooseOptions.form.type === 'fileuploader') {
          if (mongooseOptions.form.name) {
          /*  $scope.$watchCollection('filequeue.' + mongooseOptions.form.name, function (newvar) {
              $scope.record[mongooseOptions.form.name] = newvar;
            });

            $scope.$watchCollection('record.' + mongooseOptions.form.name, function (newvar) {
              $scope.filequeue[mongooseOptions.form.name] = newvar;
            });*/
          }
        } else if (mongooseOptions.form && mongooseOptions.form.type === 'gallery') {
        } else {
          throw new Error('Field ' + formInstructions.name + ' is of unsupported type ' + mongooseType.instance);
        }
        if (mongooseOptions.required) {
          formInstructions.required = true;
        }
        if (mongooseOptions.readonly) {
          formInstructions.readonly = true;
        }
        return formInstructions;
      };
  };
});

           /*
        handleSchema('Main ' + $scope.modelName, data, $scope.formSchema, $scope.listSchema, '', true);

        if (!$scope.id && !$scope.newRecord) { //this is a list. listing out contents of a collection
          allowLocationChange = true;
        } else {
          var force = true;
          $scope.$watch('record', function (newValue, oldValue) {
            if (newValue !== oldValue) {
              force = $scope.updateDataDependentDisplay(newValue, oldValue, force);
            }
          }, true);

          if ($scope.id) {
            // Going to read a record
            if (typeof $scope.dataEventFunctions.onBeforeRead === 'function') {
              $scope.dataEventFunctions.onBeforeRead($scope.id, function (err) {
                if (err) {
                  $scope.showError(err);
                } else {
                  $scope.readRecord();
                }
              });
            } else {
              $scope.readRecord();
            }
          } else {
            // New record
            master = {};
            $scope.phase = 'ready';
            $scope.cancel();
          }
        }
      }).error(function () {
        $state.go('404');*/
