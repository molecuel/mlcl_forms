mlcl_forms.form = angular.module( 'mlcl_forms.form', [
  'mlcl_forms'
])
.directive('formInput', ['$compile', '$injector', '$rootScope', 'utils', '$filter', '$templateCache','FormFactory', function ($compile, $injector, $rootScope, utils, $filter, $templateCache, FormFactory) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

        var sizeMapping = [1, 2, 4, 6, 8, 10, 12];
        var sizeDescriptions = ['mini', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'block-level'];
        var defaultSizeOffset = 2; // medium, which was the default for Twitter Bootstrap 2
        var subkeys = [];
        var tabsSetup = false;


        /**
         * isHorizontalStyle - Calculate form style
         *
         * @param  {type} formStyle description
         * @return {string}           form style
         */
        var isHorizontalStyle = function isHorizontalStyle(formStyle) {
          return (!formStyle || formStyle === 'undefined' || ['vertical', 'inline'].indexOf(formStyle) === -1);
        };


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
         * generateDefault - description
         *
         * @param  {type} common    description
         * @param  {type} options   description
         * @param  {type} fieldInfo description
         * @return {type}           description
         */
        var generateDefault = function generateDefault (common, options, fieldInfo) {
          var result = '<input ' + common + 'type="' + fieldInfo.type + '"';
          result += ' />';
          return result;
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
            modelString = (options.model || 'record') + '.';
            if (options.subschema && fieldInfo.name.indexOf('.') !== -1) {
              // Schema handling - need to massage the ngModel and the id
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
          options.modelString = modelString;
          options.nameString = nameString;
          options.idString = idString;

          if(!options.nameString && options.idString) {
            options.nameString = options.idString;
          }

          options.requiredString = (isRequired || fieldInfo.required) ? ' required' : '';
          options.readOnlyString = fieldInfo.readonly ? ' readonly' : '';
          options.placeHolder = fieldInfo.placeHolder;
          options.attributes = {};

          if (options.formstyle === 'inline') { options.placeHolder = options.placeHolder || fieldInfo.label; }

          options.attributes.model = options.modelString;
          options.attributes.name = options.nameString;

          if(options.idString) {
            options.attributes.id = options.idString;
          }

          if(options.placeholder) {
            options.attributes.placeholder = options.placeholder;
          }

          if (fieldInfo.popup) {
            options.attributes.title = fieldInfo.popup;
          }

          // @todo add classes
          //common += addAll('Field', null, options);

          if(!fieldInfo.instance) {
            fieldInfo.instance = 'string';
          }

          var handlerString2 = fieldInfo.instance;
          var handlerString1 = fieldInfo.instance+ ':'+ fieldInfo.type;

          var FieldHandler;
          if($injector.has(handlerString1)) {
            FieldHandler = $injector.get(handlerString1);
          } else if($injector.has(handlerString2)) {
            FieldHandler = $injector.has(handlerString2);
          }

          if(FieldHandler) {
            var childScope = $rootScope.$new(true);
            childScope.fieldInfo = fieldInfo;
            childScope.options = options;
            childScope.attributes = options.attributes;
            var handler = new FieldHandler(childScope);
            handler.render();
            return handler;
          }
        };
        
        /**
         * convertFormStyleToClass - Returns the style of the form
         *
         * @param  {type} aFormStyle description
         * @return {type}            description
         */
        var convertFormStyleToClass = function convertFormStyleToClass(aFormStyle) {
          var result;
          switch (aFormStyle) {
            case 'horizontal' :
              result = 'form-horizontal';
              break;
            case 'vertical' :
              result = '';
              break;
            case 'inline' :
              result = 'form-inline';
              break;
            case 'horizontalCompact' :
              result = 'form-horizontal compact';
              break;
            default:
              result = 'form-horizontal compact';
              break;
          }
          return result;
        };

        /**
         * containerInstructions - Add a wrapper around the field
         *
         * @param  {type} info description
         * @return {type}      description
         */
        var containerInstructions = function containerInstructions(info) {
          var result = {before: '', after: ''};
          if (typeof info.containerType === 'function') {
            result = info.containerType(info);
          } else {
            switch (info.containerType) {
              case 'tab' :
                result.before = '<tab heading="' + info.title + '">';
                result.after = '</tab>';
                break;
              case 'tabset' :
                result.before = '<tabset>';
                result.after = '</tabset>';
                break;
              case 'well' :
                result.before = '<div class="well">';
                if (info.title) {
                  result.before += '<h4>' + info.title + '</h4>';
                }
                result.after = '</div>';
                break;
              case 'well-large' :
                result.before = '<div class="well well-lg well-large">';
                result.after = '</div>';
                break;
              case 'well-small' :
                result.before = '<div class="well well-sm well-small">';
                result.after = '</div>';
                break;
              case 'fieldset' :
                result.before = '<fieldset>';
                if (info.title) {
                  result.before += '<legend>' + info.title + '</legend>';
                }
                result.after = '</fieldset>';
                break;
              case undefined:
                break;
              case null:
                break;
              case '':
                break;
              default:
                result.before = '<div class="' + info.containerType + '">';
                if (info.title) {
                  var titleLook = info.titleTagOrClass || 'h4';
                  if (titleLook.match(/h[1-6]/)) {
                    result.before += '<' + titleLook + '>' + info.title + '</' + info.titleLook + '>';
                  } else {
                    result.before += '<p class="' + titleLook + '">' + info.title + '</p>';
                  }
                }
                result.after = '</div>';
                break;
            }
          }
          return result;
        };

        var handleField = function handleField(info, options) {
          info.type = info.type || 'text';
          info.id = info.id || 'f_' + info.name.replace(/\./g, '_');
          info.label = (info.label !== undefined) ? (info.label === null ? '' : info.label) : $filter('titleCase')(info.name.split('.').slice(-1)[0]);

          var template = '', closeTag = '';
          var classes = '';

          classes = 'form-group';
          if (options.formstyle === 'vertical' && info.size !== 'block-level') {
            template += '<div class="row">';
            classes += ' col-xs-' + sizeMapping[info.size ? sizeDescriptions.indexOf(info.size) : defaultSizeOffset];
            closeTag += '</div>';
          }
          template += '<div' + addAll('Group', classes, options);
          closeTag += '</div>';

          var includeIndex = false;
          if (options.index) {
            try {
              parseInt(options.index, 10);
              includeIndex = true;
            } catch (err) {
              // Nothing to do
            }
          }
          if (info.showWhen) {
            if (typeof info.showWhen === 'string') {
              template += 'ng-show="' + info.showWhen + '"';
            } else {
              template += 'ng-show="' + generateNgShow(info.showWhen, options.model) + '"';
            }
          }
          if (includeIndex) {
            template += ' id="cg_' + info.id.replace('_', '-' + attrs.index + '-') + '">';
          } else {
            template += ' id="cg_' + info.id.replace(/\./g, '-') + '">';
          }

          if (info.schema) {
            var niceName = info.name.replace(/\./g, '_');
            var schemaDefName = '$_schema_' + niceName;
            scope[schemaDefName] = info.schema;
            if (info.schema) { // display as a control group
              //schemas (which means they are arrays in Mongoose)
              // Check for subkey - selecting out one or more of the array
              if (info.subkey) {
                info.subkey.path = info.name;
                scope[schemaDefName + '_subkey'] = info.subkey;

                var subKeyArray = angular.isArray(info.subkey) ? info.subkey : [info.subkey];
                for (var arraySel = 0; arraySel < subKeyArray.length; arraySel++) {
                  var topAndTail = containerInstructions(subKeyArray[arraySel]);
                  template += topAndTail.before;
                  template += processInstructions(info.schema, null, {subschema: true, formStyle: options.formstyle, subkey: schemaDefName + '_subkey', subkeyno: arraySel});
                  template += topAndTail.after;
                }
                subkeys.push(info);
              } else {
                template += '<div class="schema-head">' + info.label +
                  '</div>' +
                  '<div ng-form class="' +
                  convertFormStyleToClass(info.formStyle) + '" name="form_' + niceName + '{{$index}}" class="sub-doc well" id="' + info.id + 'List_{{$index}}" ' +
                  ' ng-repeat="subDoc in ' + (options.model || 'record') + '.' + info.name + ' track by $index">' +
                  '   <div class="row" sub-doc">' +
                  '      <div class="pull-left">' + processInstructions(info.schema, false, {subschema: true, formstyle: info.formStyle, model: options.model}) +
                  '      </div>';

                if (!info.noRemove || info.customSubDoc) {
                  template += '   <div class="pull-left sub-doc-btns">';
                  if (info.customSubDoc) {
                    template += info.customSubDoc;
                  }
                  if (!info.noRemove) {
                    template += '      <button name="remove_' + info.id + '_btn" class="remove-btn btn btn-default btn-xs form-btn" ng-click="remove(\'' + info.name + '\',$index,$event)">' +
                      '          <i class="glyphicon glyphicon-minus">';
                    template += '          </i> Remove' +
                      '      </button>';
                  }
                  template += '  </div> ';
                }
                template += '   </div>' +
                  '</div>';
                if (!info.noAdd || info.customFooter) {
                  template += '<div class = "schema-foot">';
                  if (info.customFooter) {
                    template += info.customFooter;
                  }
                  if (!info.noAdd) {
                    template += '    <button id="add_' + info.id + '_btn" class="add-btn btn btn-default btn-xs form-btn" ng-click="add(\'' + info.name + '\',$event)">' +
                      '        <i class="glyphicon glyphicon-plus"></i> Add';
                    template += '    </button>';
                  }
                  template += '</div>';
                }
              }
            }
          }


          var handlerReturn = generateInput(info, null, options.required, info.id, options);
          return handlerReturn;
        };


        var processInstructions = function (instructionsArray, topLevel, options) {
          var result = '';
          var myres = [];
          var parseSubkeyName = function parseSubkeyName(value, key) {
            return scope[options.subkey].path + '.' + key === info.name;
          };

          if (instructionsArray) {
            for (var anInstruction = 0; anInstruction < instructionsArray.length; anInstruction++) {
              var info = instructionsArray[anInstruction];
              if (anInstruction === 0 && topLevel && !options.schema.match(/$_schema_/)) {
                info.add = (info.add || '');
                if (info.add.indexOf('ui-date') === -1 && !options.noautofocus && !info.containerType) {
                  info.add = info.add + 'autofocus ';
                }
              }
              var callHandleField = true;
              if (info.directive) {
                var directiveName = info.directive;
                var newElement = '<' + directiveName + ' model="' + (options.model || 'record') + '"';
                var thisElement = element[0];
                for (var i = 0; i < thisElement.attributes.length; i++) {
                  var thisAttr = thisElement.attributes[i];
                  switch (thisAttr.nodeName) {
                    case 'class' :
                      var classes = thisAttr.value.replace('ng-scope', '');
                      if (classes.length > 0) {
                        newElement += ' class="' + classes + '"';
                      }
                      break;
                    case 'schema' :
                      var bespokeSchemaDefName = ('bespoke_' + info.name).replace(/\./g, '_');
                      scope[bespokeSchemaDefName] = angular.copy(info);
                      delete scope[bespokeSchemaDefName].directive;
                      newElement += ' schema="' + bespokeSchemaDefName + '"';
                      break;
                    default :
                      newElement += ' ' + thisAttr.nodeName + '="' + thisAttr.value + '"';
                  }
                }
                newElement += '></' + directiveName + '>';
                result += newElement;
                callHandleField = false;
              } else if (info.containerType) {
                var parts = containerInstructions(info);
                switch (info.containerType) {
                  case 'tab' :
                    // maintain support for simplified tabset syntax for now
                    if (!tabsSetup) {
                      tabsSetup = 'forced';
                      result += '<tabset>';
                    }

                    result += parts.before;
                    result += processInstructions(info.content, null, options);
                    result += parts.after;
                    break;
                  case 'tabset' :
                    tabsSetup = true;
                    result += parts.before;
                    result += processInstructions(info.content, null, options);
                    result += parts.after;
                    break;
                  default:
                    // includes wells, fieldset
                    result += parts.before;
                    result += processInstructions(info.content, null, options);
                    result += parts.after;
                    break;
                }
                callHandleField = false;
              } else if (options.subkey) {
                // Don't display fields that form part of the subkey, as they should not be edited (because in these circumstances they form some kind of key)
                var objectToSearch = angular.isArray(scope[options.subkey]) ? scope[options.subkey][0].keyList : scope[options.subkey].keyList;
                if (_.find(objectToSearch, parseSubkeyName)) {
                  callHandleField = false;
                }
              }

              if (callHandleField) {
                //                            if (groupId) {
                //                                scope['showHide' + groupId] = true;
                //                            }
                result += handleField(info, options);
                var res = handleField(info, options);
                myres.push(res);
              }
            }
          } else {
            console.log('Empty array passed to processInstructions');
          }
          return myres;

        };

        var unwatch = scope.$watch(attrs.schema, function (newValue) {
          if (newValue) {
            newValue = angular.isArray(newValue) ? newValue : [newValue];   // otherwise some old tests stop working for no real reason
            if (newValue.length > 0) {
              unwatch();
              var elementHtml = '';
              var formElement;
              var theRecord = scope[attrs.model || 'record'];      // By default data comes from scope.record

              if ((attrs.subschema || attrs.model) && !attrs.forceform) {
                elementHtml = '';
              } else {
                scope.topLevelFormName = attrs.name || 'myForm';     // Form name defaults to myForm
                // Copy attrs we don't process into form
                var customAttrs = '';
                for (var thisAttr in attrs) {
                  if (attrs.hasOwnProperty(thisAttr)) {
                    if (thisAttr[0] !== '$' && ['name', 'formstyle', 'schema', 'subschema', 'model'].indexOf(thisAttr) === -1) {
                      customAttrs += ' ' + attrs.$attr[thisAttr] + '="' + attrs[thisAttr] + '"';
                    }
                  }
                  //formElement = new FormFactory({name: scope.topLevelFormName, class: convertFormStyleToClass(attrs.formstyle) + customAttrs}).getElement();
                }
              }

              formElement = new FormFactory({name: scope.topLevelFormName});

              if(formElement) {
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

              //console.log($compile(elementHtml)(scope));
              // If there are subkeys we need to fix up ng-model references when record is read
              if (subkeys.length > 0) {
                var unwatch2 = scope.$watch('phase', function (newValue) {
                  if (newValue === 'ready') {
                    unwatch2();
                    for (var subkeyCtr = 0; subkeyCtr < subkeys.length; subkeyCtr++) {
                      var info = subkeys[subkeyCtr],
                        arrayOffset,
                        matching,
                        arrayToProcess = angular.isArray(info.subkey) ? info.subkey : [info.subkey];

                      for (var thisOffset = 0; thisOffset < arrayToProcess.length; thisOffset++) {
                        var thisSubkeyList = arrayToProcess[thisOffset].keyList;
                        var dataVal = theRecord[info.name] = theRecord[info.name] || [];
                        for (arrayOffset = 0; arrayOffset < dataVal.length; arrayOffset++) {
                          matching = true;
                          for (var keyField in thisSubkeyList) {
                            if (thisSubkeyList.hasOwnProperty(keyField)) {
                              // Not (currently) concerned with objects here - just simple types
                              if (dataVal[arrayOffset][keyField] !== thisSubkeyList[keyField]) {
                                matching = false;
                                break;
                              }
                            }
                          }
                          if (matching) {
                            break;
                          }
                        }
                        if (!matching) {
                          // There is no matching array element - we need to create one
                          arrayOffset = theRecord[info.name].push(thisSubkeyList) - 1;
                        }
                        scope['$_arrayOffset_' + info.name.replace(/\./g, '_') + '_' + thisOffset] = arrayOffset;
                      }
                    }
                  }
                });
              }

              $rootScope.$broadcast('formInputDone');
              /*if(CKEDITOR) {
                // Turn off automatic editor creation first.
                CKEDITOR.disableAutoInline = true;
              }*/

              if (scope.updateDataDependentDisplay && theRecord && Object.keys(theRecord).length > 0) {
                // If this is not a test force the data dependent updates to the DOM
                scope.updateDataDependentDisplay(theRecord, null, true);
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
      this.scope = $rootScope.$new(true);

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
