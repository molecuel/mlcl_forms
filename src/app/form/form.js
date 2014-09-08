mlcl_forms.form = angular.module( 'mlcl_forms.form', [
  'mlcl_forms',
  // should later be provided by plugin textArea
  'monospaced.elastic',
  'mlcl_forms.services',
  'flow',
  'ui.bootstrap',
  'ckeditor'
])
.directive('formInput', ['$compile', '$injector', '$rootScope', 'utils', '$filter', '$templateCache','FormFactory', 'apiService', function ($compile, $injector, $rootScope, utils, $filter, $templateCache, FormFactory, ApiService) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        // Add the attributes to the scope
        scope.attrs = attrs;

        // only run this stuff of a modelname has been defined
        if(attrs.modelname) {
          // initialize the api service which provides the model for the form by a http api
          var api = new ApiService(scope, attrs.modelname, attrs.apihost);

          // add to scope to use it in the tempalte
          scope.api = api;

          api.getSchema(function(result) {
            if(result) {
              scope.schema = result;
              if(attrs.record && api) {
                api.getRecord(attrs.record, function(err, record) {
                  scope.record = record;
                });
              }
            }
          });
        }

        if(attrs.apihost) {
          this.apihost = attrs.apihost;
        }

        var sizeMapping = [1, 2, 4, 6, 8, 10, 12];
        var defaultSizeOffset = 2; // medium, which was the default for Twitter Bootstrap 2
        var subkeys = [];
        var tabsSetup = false;

        /**
         * generateNgShow function - Calculates if a element should be shown or hidden
         *
         * @param  {type} showWhen description
         * @param  {type} model    description
         * @return {type}          description
         */
        var generateNgShow = function generateNgShow(showWhen, model) {

          function evaluateSide(side) {
            var result = side;
            if (typeof side === 'string') {
              if (side.slice(0, 1) === '$') {
                result = (model || 'record') + '.';
                var parts = side.slice(1).split('.');
                if (parts.length > 1) {
                  var lastBit = parts.pop();
                  result += parts.join('.') + '[$index].' + lastBit;
                } else {
                  result += side.slice(1);
                }
              } else {
                result = '\'' + side + '\'';
              }
            }
            return result;
          }

          var conditionText = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'],
            conditionSymbols = ['===', '!==', '>', '>=', '<', '<='],
            conditionPos = conditionText.indexOf(showWhen.comp);

          if (conditionPos === -1) { throw new Error('Invalid comparison in showWhen'); }
          return evaluateSide(showWhen.lhs) + conditionSymbols[conditionPos] + evaluateSide(showWhen.rhs);
        };

        /**
         * generateInput - Generate the input field
         *
         * @param  {type} fieldInfo   description
         * @param  {type} modelString description
         * @param  {type} isRequired  description
         * @param  {type} idString    description
         * @param  {type} options     description
         * @return {type}             description
         */
        var generateInput = function generateInput(fieldInfo, modelString, isRequired, idString, options) {
          var nameString;
          if (!modelString) {
            modelString = '';
            if (options.subschema && fieldInfo.name.indexOf('.') !== -1) {
              // Schema handling - need to message the ngModel and the id
              var compoundName = fieldInfo.name,
                lastPartStart = compoundName.lastIndexOf('.'),
                lastPart = compoundName.slice(lastPartStart + 1);
              if (options.index) {
                var cut = modelString.length;
                modelString += compoundName.slice(0, lastPartStart) + '.' + options.index + '.' + lastPart;
                idString = 'f_' + modelString.slice(cut).replace(/\./g, '-');
              } else {
                modelString += compoundName.slice(0, lastPartStart);
                if (options.subkey) {
                  modelString += '[' + '$_arrayOffset_' + compoundName.slice(0, lastPartStart).replace(/\./g, '_') + '_' + options.subkeyno + '].' + lastPart;
                  idString = compoundName + '_subkey';
                } else {
                  modelString += '[$index].' + lastPart;
                  idString = null;
                  nameString = compoundName.replace(/\./g, '-');
                }
              }
            } else {
              modelString += fieldInfo.name;
            }
          }
/*          console.log(modelString);
          console.log(options);
          console.log(fieldInfo);
*/
          var attributes = {};

          attributes.modelString = modelString;
          attributes.nameString = nameString;
          attributes.idString = idString;

          if(!attributes.nameString && attributes.idString) {
            attributes.nameString = attributes.idString;
          }

          attributes.requiredString = (isRequired || fieldInfo.required) ? 'required' : ' ';
          attributes.readOnlyString = fieldInfo.readonly ? 'readonly' : ' ';
          attributes.placeHolder = (fieldInfo.placeHolder) ? fieldInfo.placeHolder: ' ';

          if (options.formstyle === 'inline') { options.placeHolder = attributes.placeHolder || fieldInfo.label; }

          attributes.model = scope.record[modelString];
          attributes.required = (isRequired || fieldInfo.required) ? 'true': 'false';
          attributes.readonly = fieldInfo.readonly ? 'true' : 'false';
          attributes.placeholder = attributes.placeHolder;

          if(fieldInfo.max) {
            attributes.max = fieldInfo.max;
          }

          if(fieldInfo.min) {
            attributes.min = fieldInfo.min;
          }

          if(attributes.idString) {
            attributes.id = attributes.idString;
          }

          if (fieldInfo.popup) {
            attributes.title = fieldInfo.popup;
          }

          // @todo add classes
          //common += addAll('Field', null, options);

          if(!fieldInfo.instance) {
            fieldInfo.instance = 'string';
          }


          var handlerString1;
          var handlerString2;
          var handlerString3;
          var fallbackHandler = 'fallbackField';


          /**
           * Create field handler strings based on the information provided by the api
           *
           * options to find a fieldhandler:
           * 1. By the instance type of the object
           * 2. By the instance type of the object and the field type
           * 3. By the instance type of the object and the field type and the widget type
           */
          if(fieldInfo.instance) {
            handlerString3 = fieldInfo.instance;
          }

          if(handlerString3 && fieldInfo.type) {
            handlerString2 = handlerString3+ ':'+ fieldInfo.type;
          }

          if(handlerString2 && fieldInfo.widget) {
            handlerString1 = handlerString2 + ':' + fieldInfo.widget;
          }

          var debugHandler = false;
          if(debugHandler === true) {
            if(handlerString1) {
              console.log(handlerString1);
            } else if(handlerString2) {
              console.log(handlerString2);
            } else if(handlerString3) {
              console.log(handlerString3);
            }
          }

          var FieldHandler;
          if($injector.has(handlerString1)) {
            FieldHandler = $injector.get(handlerString1);
          } else if(typeof FieldHandler !== 'function' && $injector.has(handlerString2)) {
            FieldHandler = $injector.get(handlerString2);
          } else if(typeof FieldHandler !== 'function' && $injector.has(handlerString3)) {
            FieldHandler = $injector.get(handlerString3);
          } else {
            if($injector.has(fallbackHandler)) {
              FieldHandler = $injector.get(fallbackHandler);
            }
          }

          // check if there is a fieldHandler registered for that field
          if(typeof FieldHandler === 'function') {
            // create a new scope an inherit the parents scope prototype functions
            var childScope = scope.$new();

            // check if there is already a object childScopes on the parent scope
            if(!scope.childScopes) {
              scope.childScopes = {};
            }

            // add the childScope to the main scope of the form
            scope.childScopes[modelString] = childScope;
            // add the additional field information to the childScope
            childScope.fieldInfo = fieldInfo;
            // add all the attributes to the childScope
            childScope.attributes = attributes;
            // add the model record to the childScope
            childScope.model = attributes.model;
            // set the modelString on the childScope
            childScope.modelstring = modelString;
            // watch the subscope and push changes to the current scope record
            childScope.$watch('model', function(val) {
              scope.record[childScope.modelstring] = val;
            });

            // watch for changes on the record for the model
            scope.$watch('record.'+modelString, function(val) {
              childScope.model = val;
            });
            // create a new fieldHandler based on the childScope
            var handler = new FieldHandler(childScope);
            handler.scope = childScope;
            // render the html template and add the variables
            handler.render();
            return handler;
          }
        };

        var handleField = function handleField(info, options) {
          info.id = info.id || 'f_' + info.name.replace(/\./g, '_');
          info.label = (info.label !== undefined) ? (info.label === null ? '' : info.label) : $filter('titleCase')(info.name.split('.').slice(-1)[0]);
          var handlerReturn = generateInput(info, null, options.required, info.id, options);
          return handlerReturn;
        };



        /**
         * processInstructions - Process the form instructions served by the schema
         *
         * @param  {type} instructionsArray description
         * @param  {type} topLevel          description
         * @param  {type} options           description
         * @return {type}                   description
         */
        var processInstructions = function processInstructions(instructionsArray, topLevel, options) {
          var myres = [];
          var parseSubkeyName = function parseSubkeyName(value, key) {
            return scope[options.subkey].path + '.' + key === info.name;
          };

          if (instructionsArray) {
            for (var anInstruction = 0; anInstruction < instructionsArray.length; anInstruction++) {
              var info = instructionsArray[anInstruction];
              var callHandleField = true;
              // Directive function has been removed
              // check if it's a subkey
              if (options.subkey) {
                // Don't display fields that form part of the subkey, as they should not be edited (because in these circumstances they form some kind of key)
                var objectToSearch = angular.isArray(scope[options.subkey]) ? scope[options.subkey][0].keyList : scope[options.subkey].keyList;
                if (_.find(objectToSearch, parseSubkeyName)) {
                  callHandleField = false;
                }
              }

              // here happens the real magic to get the template and parse
              // the data for the field type
              if (callHandleField) {
                var res = handleField(info, options);
                myres.push(res);
              }
            }
          } else {
            console.log('Empty array passed to processInstructions');
          }
          return myres;

        };

        /**
         * watch function - watch function for attrs.schema
         *
         * @param  {string} attrs.schema baseSchema()
         * @callback {function}
         */
        var unwatch = scope.$watch('schema', function (newValue) {
          if (newValue) {
            if (newValue.length > 0) {
              unwatch();
              var elementHtml = '';
              var theRecord = scope[attrs.model || 'record'];      // By default data comes from scope.record
              if ((attrs.subschema || attrs.model) && !attrs.forceform) {
                elementHtml = '';
              } else {
                scope.topLevelFormName = attrs.name || 'myForm';     // Form name defaults to myForm
                formElement = new FormFactory({name: scope.topLevelFormName});
              }

              if (theRecord === scope.topLevelFormName) { throw new Error('Model and Name must be distinct - they are both ' + theRecord); }
              if(formElement) {
                // get the form element
                elementHtml = processInstructions(newValue, true, attrs);

                // Get the form element via form factory
                for(var i in elementHtml) {
                  if(elementHtml[i]) {
                    formElement.append(elementHtml[i].htmlObject);
                  }
                }

                // replcate the element and add the form to the html
                element.replaceWith(formElement.htmlObject);
              }

              $rootScope.$broadcast('formInputDone');
              if (scope.updateDataDependentDisplay && theRecord && Object.keys(theRecord).length > 0) {
                // If this is not a test force the data dependent updates to the DOM
                scope.generateListQuery(theRecord, null, true);
              }
            }
          }

        }, true);

        function addAll(type, additionalClasses, options) {
          var action = 'getAddAll' + type + 'Options';
          return utils[action](scope, options, additionalClasses) || [];
        }
      }
    };
  }])
  .service('utils', function () {

    this.getAddAllGroupOptions = function (scope, attrs, classes) {
      return getAddAllOptions(scope, attrs, "Group", classes);
    };

    this.getAddAllFieldOptions = function (scope, attrs, classes) {
      return getAddAllOptions(scope, attrs, "Field", classes);
    };

    this.getAddAllLabelOptions = function (scope, attrs, classes) {
      return getAddAllOptions(scope, attrs, "Label", classes);
    };

    function getAddAllOptions(scope, attrs, type, classes) {

      var addAllOptions = [],
        classList = [],
        tmp, i, options;

      type = "addAll" + type;

      if (typeof(classes) === 'string') {
        tmp = classes.split(' ');
        for (i = 0; i < tmp.length; i++) {
          classList.push(tmp[i]);
        }
      }

      function getAllOptions(obj) {

        for (var key in obj) {
          if (key === type) {
            addAllOptions.push(obj[key]);
          }

          if (key === "$parent") {
            getAllOptions(obj[key]);
          }
        }
      }

      getAllOptions(scope);

      if (attrs[type] !== undefined) {

        if (typeof(attrs[type]) === "object") {

          //support objects...

        } else if (typeof(attrs[type]) === "string") {

          tmp = attrs[type].split(' ');

          for (i = 0; i < tmp.length; i++) {
            if (tmp[i].indexOf('class=') === 0) {
              classList.push(tmp[i].substring(6, tmp[i].length));
            } else {
              addAllOptions.push(tmp[i]);
            }
          }
        } else {
          // return false; //error?
        }
      }

      if (classList.length > 0) {
        classes = ' class="' + classList.join(" ") + '" ';
      } else {
        classes = " ";
      }

      if (addAllOptions.length > 0) {
        options = addAllOptions.join(" ") + " ";
      } else {
        options = "";
      }

      return classes + options;

    }

})
/**
 * Factory method to create the form itself
 **/
.factory('FormFactory', function($compile, $templateCache, $rootScope) {
    return function(fieldInfo, options) {
      this.options = options;
      this.fieldInfo = fieldInfo;
      this.scope = $rootScope.$new();

      var self = this;
      this.render = function() {
        var inputHtml = $templateCache.get('form/form.tpl.html');
        self.htmlObject = $compile(inputHtml)(self.scope);
        return self;
      };

      this.append = function(htmlObject) {
        if(!self.htmlObject) {
          self.render();
        }

        if(self.htmlObject) {
          self.htmlObject.append(htmlObject);
        }
      };
    };
});
