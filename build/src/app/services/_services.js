var mlcl_forms_services = angular.module('mlcl_forms.services', ['angular-growl']);
mlcl_forms_services.factory('apiService', [
  '$http',
  '$filter',
  'schemaService',
  'recordService',
  'growl',
  '$rootScope',
  function ($http, $filter, SchemaService, RecordService, growl, $rootScope) {
    return function (directiveScope, modelName, apiHost) {
      var self = this;
      this.modelName = modelName;
      this.apiHost = apiHost;
      this.schemaService = new SchemaService(modelName);
      this.recordService = new RecordService(this);
      this.getSchema = function getSchema(callback) {
        if (!self.apiHost) {
          self.apiHost = '';
        }
        $http.get(self.apiHost + '/api/schema/' + self.modelName, { cache: true }).success(function (data) {
          if (data) {
            var schema = self.schemaService.handleFormSchema(data, true, '');
            self.schema = schema;
            callback(schema);
          }
        }).error(self.handleError);
      };
      this.getRecord = function getRecord(recordId, callback) {
        $http.get(self.apiHost + '/api/' + self.modelName + '/' + recordId).success(function (data) {
          if (data.success === false) {
            self.showMessage('error', 'Error while fetching record');
          }
          var record = self.recordService.convertToAngularModel(self.schema, data, 0);
          self.record = record;
          callback(null, self.record);
        }).error(self.handleError);
      };
      this.listCollection = function listCollection(page, pageSize, callback) {
        if (!page) {
          page = 1;
        }
        if (!pageSize) {
          pageSize = 50;
        }
        $http.get(self.apiHost + '/api/' + self.modelName + '?page=' + page + '&pageSize=' + pageSize).success(function (data) {
          if (data.success === false) {
            console.log('err');
          }
          callback(null, data);
        }).error(this.handleError);
      };
      this.save = function save(id, record) {
        var dataToSave = self.recordService.convertToMongoModel(self.schema, angular.copy(record), 0);
        if (id) {
          self.updateDocument(id, dataToSave);
        } else {
          self.createNew(dataToSave);
        }
      };
      this.createNew = function (dataToSave) {
        $http.post(self.apiHost + '/api/' + self.modelName, dataToSave).success(function (data) {
          if (data.success === false) {
            console.log('err');
          }
          growl.addInfoMessage('Saved');
        }).error(self.handleError);
      };
      this.handleError = function handleError(data, status) {
        if ([
            200,
            400
          ].indexOf(status) !== -1) {
          var errorMessage = '';
          for (var errorField in data.errors) {
            if (data.errors.hasOwnProperty(errorField)) {
              switch (data.errors[errorField].type) {
              case 'enum':
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
        $http.post(self.apiHost + '/api/' + self.modelName + '/' + id, dataToSave).success(function (data) {
          if (data) {
            var record = self.recordService.convertToAngularModel(self.schema, data, 0);
            self.record = record;
            directiveScope.phase = 'ready';
            growl.addInfoMessage('Saved');
          }
        }).error(self.handleError);
      };
    };
  }
]);
mlcl_forms_services.factory('schemaService', function () {
  return function (modelName) {
    var self = this;
    this.modelName = modelName;
    this.select2List = [];
    this.handleFormSchema = function handleSchema(source, doRecursion, prefix) {
      if (!prefix) {
        prefix = '';
      }
      var destForm = [];
      for (var field in source) {
        if (field !== '_id' && source.hasOwnProperty(field)) {
          var mongooseType = source[field], mongooseOptions = mongooseType.options || {};
          var formData = mongooseOptions.form || {};
          if (!formData.hidden) {
            if (mongooseType.array) {
              if (mongooseType.schema) {
                var sub = self.handleSubSchema(mongooseType, field, prefix);
                destForm.push(sub);
              }
            } else {
              var formInstructions = self.basicInstructions(field, formData, prefix);
              if (field !== 'options') {
                var formInst = self.handleFieldType(formInstructions, mongooseType, mongooseOptions);
                if (formData.order !== undefined) {
                  destForm.splice(formData.order, 0, formInst);
                } else {
                  destForm.push(formInst);
                }
              }
            }
          }
        }
      }
      return destForm;
    };
    this.handleSubSchema = function handleSubSchema(mongooseType, field, prefix) {
      mongooseType.type = 'fieldset';
      mongooseType.instance = 'array';
      var subSchema = {
          schema: [],
          type: mongooseType.type,
          instance: mongooseType.instance,
          name: field
        };
      if (!mongooseType.options) {
        mongooseType.options = {};
      }
      subSchema.options = mongooseType.options;
      if (mongooseType.schema) {
        _.each(mongooseType.schema, function (item) {
          if (item.path === 'mlcl_form') {
            if (item.options && item.options.form && item.options.form.widget) {
              subSchema.widget = item.options.form.widget;
            }
          } else {
            var formInstructions = self.basicInstructions(item.path, item, prefix);
            var formInst = self.handleFieldType(formInstructions, item, item.options);
            subSchema.schema.push(formInst);
          }
        });
      }
      return subSchema;
    };
    this.basicInstructions = function basicInstructions(field, formData, prefix) {
      formData.name = prefix + field;
      return formData;
    };
    this.handleFieldType = function handleFieldType(formInstructions, mongooseType, mongooseOptions) {
      if (mongooseType.caster) {
        formInstructions.array = true;
        mongooseType = mongooseType.caster;
        angular.extend(mongooseOptions, mongooseType.options);
      }
      formInstructions.instance = mongooseType.instance.toLowerCase();
      if (formInstructions.type) {
        formInstructions.type = formInstructions.type.toLowerCase();
      }
      if (mongooseOptions.enum) {
        formInstructions.enum = mongooseOptions.enum;
      }
      if (mongooseType.instance === 'String') {
        if (mongooseOptions.enum) {
          formInstructions.type = formInstructions.type || 'select';
          if (formInstructions.select2) {
            self['select2' + formInstructions.name] = {
              allowClear: !mongooseOptions.required,
              initSelection: function (element, callback) {
                callback(element.select2('data'));
              },
              query: function (query) {
                var data = { results: [] }, searchString = query.term.toUpperCase();
                for (var i = 0; i < mongooseOptions.enum.length; i++) {
                  if (mongooseOptions.enum[i].toUpperCase().indexOf(searchString) !== -1) {
                    data.results.push({
                      id: i,
                      text: mongooseOptions.enum[i]
                    });
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
            formInstructions.type = formInstructions.name.toLowerCase().indexOf('password') !== -1 ? 'password' : 'text';
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
        if (mongooseOptions.min) {
          formInstructions.add = 'min="' + mongooseOptions.min + '" ' + (formInstructions.add || '');
        }
        if (mongooseOptions.max) {
          formInstructions.add = 'max="' + mongooseOptions.max + '" ' + (formInstructions.add || '');
        }
        if (formInstructions.step) {
          formInstructions.add = 'step="' + formInstructions.step + '" ' + (formInstructions.add || '');
        }
      } else if (mongooseType.instance === 'Object') {
        formInstructions.type = formInstructions.type || 'textarea';
      }
      if (mongooseOptions.required) {
        formInstructions.required = true;
      }
      if (mongooseOptions.readonly) {
        formInstructions.readonly = true;
      }
      return formInstructions;
    };
    this.suffixCleanId = function suffixCleanId(inst, suffix) {
      return (inst.id || 'f_' + inst.name).replace(/\./g, '_') + suffix;
    };
  };
});
mlcl_forms_services.factory('schemaContainerService', function () {
  return function (formInstructions, model) {
    var self = this;
    this.addElement = function () {
    };
  };
});