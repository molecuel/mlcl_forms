var mlcl_forms_services = angular.module('mlcl_forms.services', ['angular-growl']);

mlcl_forms_services.factory('apiService', ['$http', '$filter','schemaService', 'recordService', 'growl', '$rootScope', function($http, $filter, SchemaService, RecordService, growl, $rootScope) {

  return function(directiveScope, modelName, apiHost) {
    var self = this;
    this.modelName = modelName;
    this.apiHost = apiHost;
    this.schemaService = new SchemaService(modelName);
    // Initialize a new instance of recordService and add SchemaService
    this.recordService = new RecordService(this);

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
          self.schema = schema;
          callback(schema);
        }
      }).error(self.handleError);
    };

    this.getRecord = function getRecord(recordId, callback) {
      $http.get( self.apiHost + '/api/' + self.modelName + '/' + recordId).success(function (data) {
        if (data.success === false) {
          self.showMessage('error', 'Error while fetching record');
        }

        var record = self.recordService.convertToAngularModel(self.schema, data, 0);
        self.record = record;
        callback(null, self.record);
      }).error(self.handleError);
    };

    this.listCollection = function listCollection(page, pageSize, callback) {
      if(!page) {
        page = 1;
      }
      if(!pageSize) {
        pageSize = 50;
      }
      $http.get( self.apiHost + '/api/' + self.modelName+'?page='+page+'&pageSize='+pageSize).success(function (data) {
        if (data.success === false) {
          console.log('err');
        }
        callback(null, data);
      }).error(this.handleError);
    };

    this.save = function save(id, record) {
      //Convert the lookup values into ids
      var dataToSave = self.recordService.convertToMongoModel(self.schema, angular.copy(record), 0);
      if (id) {
        self.updateDocument(id, dataToSave);
      } else {
        self.createNew(dataToSave);
      }
    };

    this.createNew = function (dataToSave) {
      $http.post( self.apiHost + '/api/' + self.modelName, dataToSave).success(function (data) {
        if (data.success === false) {
          console.log('err');
        }
        growl.addInfoMessage('Saved');
      }).error(self.handleError);
    };

    this.handleError = function handleError(data, status) {
      if ([200, 400].indexOf(status) !== -1) {
        var errorMessage = '';
        for (var errorField in data.errors) {
          if (data.errors.hasOwnProperty(errorField)) {
            switch (data.errors[errorField].type) {
              case 'enum' :
                errorMessage = 'You need to select from the list of values';
                break;
              default:
                errorMessage = data.errors[errorField].message;
                break;
            }
          }
        }
        if (errorMessage.length > 0) {
          errorMessage = data.message + ': ' + errorMessage;
        } else {
          errorMessage = data.message || 'Error!  Sorry - No further details available.';
        }
        self.showMessage('error', errorMessage);
      } else {
        self.showMessage('error', status + ' ' + JSON.stringify(data));
      }
    };

    this.showMessage = function showError(level, message) {
      switch (level) {
        case 'error':
          growl.addErrorMessage(message);
          break;
        case 'warn':
          growl.addWarnMessage(message);
          break;
        case 'info':
          growl.addInfoMessage(message);
          break;
        case 'success':
          growl.addSuccessMessage(message);
          break;
      }

    };

    this.updateDocument = function updateDocument(id, dataToSave) {
      directiveScope.phase = 'updating';
      $http.post( self.apiHost + '/api/' + self.modelName + '/' + id, dataToSave).success(function (data) {
        if(data) {
          var record = self.recordService.convertToAngularModel(self.schema, data, 0);
          self.record = record;
          directiveScope.phase = 'ready';
          growl.addInfoMessage('Saved');
        }
        /*if (data.success !== false) {
          if (typeof $scope.dataEventFunctions.onAfterUpdate === 'function') {
            $scope.dataEventFunctions.onAfterUpdate(data, master);
          }
          if (options.redirect) {
            if (options.allowChange) {
              allowLocationChange = true;
            }
            $window.location = options.redirect;
          } else {
            $scope.processServerData(data);
            $scope.setPristine();
          }
        } else {
          $scope.showError(data);
        }*/
      }).error(self.handleError);
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

    this.select2List = [];

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
            if (mongooseType.array) {
              if(mongooseType.schema) {
                var sub = self.handleSubSchema(mongooseType, field, prefix);
                destForm.push(sub);
              } else if(mongooseType.caster) {
                var subArr = self.handleSubSchema(mongooseType, field, prefix);
                destForm.push(subArr);
              }
            /*  if (doRecursion && destForm) {
                console.log(mongooseType);

                var schemaSchema = self.handleFormSchema(mongooseType.schema, true,field + '.');
                var sectionInstructions = self.basicInstructions(field, formData, prefix);
                sectionInstructions.schema = schemaSchema;
                // tab function currently removed
                //if (formData.tab) { handletabInfo(formData.tab, sectionInstructions); }
                if (formData.order !== undefined) {
                  destForm.splice(formData.order, 0, sectionInstructions);
                } else {
                  destForm.push(sectionInstructions);
                }
              }*/
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
     * handleSubSchema - handle a subschema in an array
     *
     * @param  {type} mongooseType description
     * @param  {type} field        description
     * @param  {type} prefix       description
     * @return {type}              description
     */
    this.handleSubSchema = function handleSubSchema(mongooseType, field, prefix) {
      mongooseType.type = 'fieldset';
      mongooseType.instance = 'array';

      var subSchema = {
        schema: [],
        type: mongooseType.type,
        instance: mongooseType.instance,
        name: field
      };

      if(!mongooseType.options) {
        mongooseType.options = {};
      }

      subSchema.options = mongooseType.options;

      // check if there is a schema
      if(mongooseType.schema) {
        // iterate over the schema
        _.each(mongooseType.schema, function(item) {
          if(item.path === 'mlcl_form') {
            if(item.options && item.options.form && item.options.form.widget) {
              subSchema.widget = item.options.form.widget;
            }
          } else {
            var formInstructions = self.basicInstructions(item.path, item, prefix);
            var formInst = self.handleFieldType(formInstructions, item, item.options);
            subSchema.schema.push(formInst);
          }
        });
      } else if(mongooseType.caster) {
        var caster = mongooseType.caster;
        if(caster.options && caster.options.form && caster.options.form.arraywidget) {
          subSchema.widget = caster.options.form.widget;
        }
      }
      return subSchema;
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
        if (mongooseType.caster) {
          formInstructions.array = true;
          mongooseType = mongooseType.caster;
          angular.extend(mongooseOptions, mongooseType.options);
        }

        formInstructions.instance = mongooseType.instance.toLowerCase();
        if(formInstructions.type) {
          formInstructions.type = formInstructions.type.toLowerCase();
        }

        if(mongooseOptions.enum) {
          formInstructions.enum = mongooseOptions.enum;
        }

        if (mongooseType.instance === 'String') {
          if (mongooseOptions.enum) {
            formInstructions.type = formInstructions.type || 'select';
            // Hacky way to get required styling working on select controls
            // @todo Check this to handle it in another function
            /*if (mongooseOptions.required) {
              $scope.$watch('record.' + formInstructions.name, function (newValue) {
                updateInvalidClasses(newValue, formInstructions.id, formInstructions.select2);
              }, true);
              setTimeout(function () {
                updateInvalidClasses($scope.record[formInstructions.name], formInstructions.id, formInstructions.select2);
              }, 0);
            }*/
            if (formInstructions.select2) {
              self['select2' + formInstructions.name] = {
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
              _.extend(self['select2' + formInstructions.name], formInstructions.select2);
              formInstructions.select2.s2query = 'select2' + formInstructions.name;
              self.select2List.push(formInstructions.name);
            } else {
              formInstructions.options = self.suffixCleanId(formInstructions, 'Options');
              self[formInstructions.options] = mongooseOptions.enum;
            }
          } else {
            if (!formInstructions.type) {
              formInstructions.type = (formInstructions.name.toLowerCase().indexOf('password') !== -1) ? 'password' : 'text';
            }
            if (mongooseOptions.match) {
              formInstructions.add = 'pattern="' + mongooseOptions.match + '" ' + (formInstructions.add || '');
            }
          }
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
        } else if(mongooseType.instance === 'Object') {
          formInstructions.type = formInstructions.type || 'jsonedit';
        }
        if (mongooseOptions.required) {
          formInstructions.required = true;
        }
        if (mongooseOptions.readonly) {
          formInstructions.readonly = true;
        }

        return formInstructions;
      };

      /**
       * suffixCleanId - Create the id
       *
       * @param  {type} inst   description
       * @param  {type} suffix description
       * @return {type}        description
       */
      this.suffixCleanId = function suffixCleanId(inst, suffix) {
        return (inst.id || 'f_' + inst.name).replace(/\./g, '_') + suffix;
      };
  };
});

/**
 * schema container handling factory
 */
mlcl_forms_services.factory('schemaContainerService', function() {

  return function(formInstructions, model) {
    var self = this;

    this.addElement = function() {

    };
  };
});
