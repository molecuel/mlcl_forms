var mlcl_forms = angular.module('mlcl_forms', [
  'templates-app',
  'templates-common',
  'ui.bootstrap',
  'ui.router',
  'mlcl_forms.form'
])
.controller('BaseCtrl', ['$scope','$http', '$filter', '$data', '$modal', '$window','$state', '$stateParse',
  function ($scope, $http, $filter, $data, $modal, $window, $state, $stateParse, fileUpload) {
    var master = {};
    var fngInvalidRequired = 'fng-invalid-required';
    var sharedStuff = $data;
    var allowLocationChange = true;   // Set when the data arrives..

    sharedStuff.baseScope = $scope;
    $scope.record = sharedStuff.record;
    $scope.phase = 'init';
    $scope.disableFunctions = sharedStuff.disableFunctions;
    $scope.dataEventFunctions = sharedStuff.dataEventFunctions;
    $scope.topLevelFormName = undefined;
    $scope.formSchema = [];
    $scope.tabs = [];
    $scope.listSchema = [];
    $scope.recordList = [];
    $scope.dataDependencies = {};
    $scope.select2List = [];
    $scope.pageSize = 20;
    $scope.pagesLoaded = 0;
    $scope.apiHost = 'http://localhost:3001';
    //$scope.filequeue = fileUpload.fieldData;

    $scope.init = function init(options) {
      console.log('init');
      Object.keys(options).forEach(function(key) {
          $scope[key] = options[key];
      });
    };


    $scope.go = function(state, params) {
      $state.go(state, params);
    };

    $scope.getId = function (obj) {
      return obj._id;
    };

    $scope.walkTree = function (object, fieldname, element) {
      // Walk through subdocs to find the required key
      // for instance walkTree(master,'address.street.number',element)
      // called by getData and setData

      // element is used when accessing in the context of a input, as the id (like exams-2-grader)
      // gives us the element of an array (one level down only for now)
      // TODO: nesting breaks this
      var parts = fieldname.split('.'),
        higherLevels = parts.length - 1,
        workingRec = object;

      for (var i = 0; i < higherLevels; i++) {
        workingRec = workingRec[parts[i]];
        if (angular.isArray(workingRec)) {
          // If we come across an array we need to find the correct position
          workingRec = workingRec[element.scope().$index];
        }
        if (!workingRec) {
          break;
        }
      }
      return {lastObject: workingRec, key: workingRec ? parts[higherLevels] : undefined};
    };

    $scope.getData = function (object, fieldname, element) {
      console.log(getData);
      var leafData = $scope.walkTree(object, fieldname, element);
      return (leafData.lastObject && leafData.key) ? leafData.lastObject[leafData.key] : undefined;
    };

    $scope.setData = function (object, fieldname, element, value) {
      console.log(setData);
      var leafData = $scope.walkTree(object, fieldname, element);
      leafData.lastObject[leafData.key] = value;
    };

    function updateInvalidClasses(value, id, select2) {
      var target = '#' + ((select2) ? 'cg_' : '') + id;
      if (value) {
        $(target).removeClass(fngInvalidRequired);
      } else {
        $(target).addClass(fngInvalidRequired);
      }
    }

    var suffixCleanId = function (inst, suffix) {
      return (inst.id || 'f_' + inst.name).replace(/\./g, '_') + suffix;
    };

    var handleListInfo = function (destList, listOptions, field) {
      var listData = listOptions || {hidden: true};
      if (!listData.hidden) {
        if (typeof listData === 'object') {
          listData.name = field;
          destList.push(listData);
        } else {
          destList.push({name: field});
        }
      }
    };

    var handleEmptyList = function (description, destList, destForm, source) {
      // If no list fields specified use the first non hidden string field
      if (destForm) {
        for (var i = 0, l = destForm.length; i < l; i++) {
          if (destForm[i].type === 'text') {
            destList.push({name: destForm[i].name});
            break;
          }
        }
        if (destList.length === 0 && destForm.length !== 0) {
          // If it is still blank then just use the first field
          destList.push({name: destForm[0].name});
        }
      }

      if (destList.length === 0) {
        // If it is still blank then just use the first field from source
        for (var field in source) {
          if (field !== '_id' && source.hasOwnProperty(field)) {
            destList.push({name: field});
            break;
          }
        }
        if (destList.length === 0) {
          throw new Error('Unable to generate a title for ' + description);
        }
      }
    };

    var evaluateConditional = function (condition, data) {
      console.log('evaluateConditional');
      function evaluateSide(side) {
        var result = side;
        if (typeof side === 'string' && side.slice(0, 1) === '$') {
          var sideParts = side.split('.');
          switch (sideParts.length) {
            case 1:
              result = $scope.getListData(data, side.slice(1));
              break;
            case 2 :
              // this is a sub schema element, and the appropriate array element has been passed
              result = $scope.getListData(data, sideParts[1]);
              break;
            default:
              throw new Error('Unsupported showIf format');
          }
        }
        return result;
      }

      var lhs = evaluateSide(condition.lhs),
        rhs = evaluateSide(condition.rhs),
        result;

      switch (condition.comp) {
        case 'eq' :
          result = (lhs === rhs);
          break;
        case 'ne' :
          result = (lhs !== rhs);
          break;
        default :
          throw new Error('Unsupported comparator ' + condition.comp);
      }
      return result;
    };

//    Conditionals
//    $scope.dataDependencies is of the form {fieldName1: [fieldId1, fieldId2], fieldName2:[fieldId2]}

    var handleConditionals = function (condInst, name) {
      console.log('handleConditionals');
      var dependency = 0;

      function handleVar(theVar) {
        if (typeof theVar === 'string' && theVar.slice(0, 1) === '$') {
          var fieldName = theVar.slice(1);
          var fieldDependencies = $scope.dataDependencies[fieldName] || [];
          fieldDependencies.push(name);
          $scope.dataDependencies[fieldName] = fieldDependencies;
          dependency += 1;
        }
      }

      var display = true;
      if (condInst) {
        handleVar(condInst.lhs);
        handleVar(condInst.rhs);
        if (dependency === 0 && !evaluateConditional(condInst)) {
          display = false;
        }
      }
      return display;
    };

// TODO: Think about nested arrays
// This doesn't handle things like :
// {a:"hhh",b:[{c:[1,2]},{c:[3,4]}]}
    $scope.getListData = function (record, fieldName) {
      var nests = fieldName.split('.');
      for (var i = 0; i < nests.length; i++) {
        if (record !== undefined) {
          record = record[nests[i]];
        }
      }
      if (record && $scope.select2List.indexOf(nests[i - 1]) !== -1) {
        record = record.text;
      }
      if (record === undefined) {
        record = '';
      }
      return record;
    };

    // Conventional view is that this should go in a directive.  I reckon it is quicker here.
    $scope.updateDataDependentDisplay = function (curValue, oldValue, force) {
      var depends, i, j, k, element;

      var forceNextTime;
      for (var field in $scope.dataDependencies) {
        if ($scope.dataDependencies.hasOwnProperty(field)) {
          var parts = field.split('.');
          // TODO: what about a simple (non array) subdoc?
          if (parts.length === 1) {
            if (force || !oldValue || curValue[field] !== oldValue[field]) {
              depends = $scope.dataDependencies[field];
              for (i = 0; i < depends.length; i += 1) {
                var name = depends[i];
                for (j = 0; j < $scope.formSchema.length; j += 1) {
                  if ($scope.formSchema[j].name === name) {
                    element = angular.element('#cg_' + $scope.formSchema[j].id);
                    if (evaluateConditional($scope.formSchema[j].showIf, curValue)) {
                      element.removeClass('ng-hide');
                    } else {
                      element.addClass('ng-hide');
                    }
                  }
                }
              }
            }
          } else if (parts.length === 2) {
            if (forceNextTime === undefined) {
              forceNextTime = true;
            }
            if (curValue[parts[0]]) {
              for (k = 0; k < curValue[parts[0]].length; k++) {
                // We want to carry on if this is new array element or it is changed
                if (force || !oldValue || !oldValue[parts[0]] || !oldValue[parts[0]][k] || curValue[parts[0]][k][parts[1]] !== oldValue[parts[0]][k][parts[1]]) {
                  depends = $scope.dataDependencies[field];
                  for (i = 0; i < depends.length; i += 1) {
                    var nameParts = depends[i].split('.');
                    if (nameParts.length !== 2) { throw new Error('Conditional display must control dependent fields at same level '); }
                    for (j = 0; j < $scope.formSchema.length; j += 1) {
                      if ($scope.formSchema[j].name === nameParts[0]) {
                        var subSchema = $scope.formSchema[j].schema;
                        for (var l = 0; l < subSchema.length; l++) {
                          if (subSchema[l].name === depends[i]) {
                            element = angular.element('#f_' + nameParts[0] + 'List_' + k + ' #cg_f_' + depends[i].replace('.', '_'));
                            if (element.length === 0) {
                              // Test Plait care plan structures if you change next line
                              element = angular.element('#f_elements-' + k + '-' + nameParts[1]);
                            } else {
                              forceNextTime = false;  // Because the sub schema has been rendered we don't need to do this again until the record changes
                            }
                            if (element.length > 0) {
                              if (evaluateConditional($scope.formSchema[j].schema[l].showIf, curValue[parts[0]][k])) {
                                element.show();
                              } else {
                                element.hide();
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            // TODO: this needs rewrite for nesting
            throw new Error('You can only go down one level of subdocument with showIf');
          }
        }
      }
      return forceNextTime;
    };

    function generateListQuery() {
      var queryString = '?l=' + $scope.pageSize,
        addParameter = function (param, value) {
          if (value && value !== '') {
            queryString += '&' + param + '=' + value;
          }
        };

      addParameter('f', $routeParams.f);
      addParameter('a', $routeParams.a);
      addParameter('o', $routeParams.o);
      addParameter('s', $scope.pagesLoaded * $scope.pageSize);
      $scope.pagesLoaded++;
      return queryString;
    }

    $scope.scrollTheList = function () {
      $http.get( $scope.apiHost + '/api/' + $scope.modelName + generateListQuery()).success(function (data) {
        if (angular.isArray(data)) {
          $scope.recordList = $scope.recordList.concat(data);
        } else {
          $scope.showError(data, 'Invalid query');
        }
      }).error(function () {
        $state.go('404');
      });
    };
///api/schema/' + $scope.modelName + ($scope.formName ? '/' + $scope.formName : ''

    $scope.setPristine = function () {
      $scope.dismissError();
      if ($scope[$scope.topLevelFormName]) {
        $scope[$scope.topLevelFormName].$setPristine();
      }
    };

    $scope.deleteRecord = function (model, id) {
      $http['delete']( $scope.apiHost + '/api/' + model + '/' + id).success(function () {
        if (typeof $scope.dataEventFunctions.onAfterDelete === 'function') {
          $scope.dataEventFunctions.onAfterDelete(master);
        }
        $location.path('/' + $scope.modelName);
      });
    };

    $scope.isCancelDisabled = function () {
      if (typeof $scope.disableFunctions.isCancelDisabled === 'function') {
        return $scope.disableFunctions.isCancelDisabled($scope.record, master, $scope[$scope.topLevelFormName]);
      } else {
        return $scope[$scope.topLevelFormName] && $scope[$scope.topLevelFormName].$pristine;
      }
    };

    $scope.isSaveDisabled = function () {
      if (typeof $scope.disableFunctions.isSaveDisabled === 'function') {
        return $scope.disableFunctions.isSaveDisabled($scope.record, master, $scope[$scope.topLevelFormName]);
      } else {
        return ($scope[$scope.topLevelFormName] && ($scope[$scope.topLevelFormName].$invalid || $scope[$scope.topLevelFormName].$pristine));
      }
    };

    $scope.isDeleteDisabled = function () {
      if (typeof $scope.disableFunctions.isDeleteDisabled === 'function') {
        return $scope.disableFunctions.isDeleteDisabled($scope.record, master, $scope[$scope.topLevelFormName]);
      } else {
        return (!$scope.id);
      }
    };

    $scope.isNewDisabled = function () {
      if (typeof $scope.disableFunctions.isNewDisabled === 'function') {
        return $scope.disableFunctions.isNewDisabled($scope.record, master, $scope[$scope.topLevelFormName]);
      } else {
        return false;
      }
    };

    $scope.disabledText = function (localStyling) {
      var text = '';
      if ($scope.isSaveDisabled) {
        text = 'This button is only enabled when the form is complete and valid.  Make sure all required inputs are filled in. ' + localStyling;
      }
      return text;
    };

    $scope.skipCols = function (index) {
      return index > 0 ? 'col-md-offset-2' : '';
    };

    $scope.setFormDirty = function (event) {
      if (event) {
        var form = angular.element(event.target).inheritedData('$formController');
        form.$setDirty();
      } else {
        console.log('setFormDirty called without an event (fine in a unit test)');
      }
    };

    $scope.add = function (fieldName, $event) {
      var arrayField;
      var fieldParts = fieldName.split('.');
      arrayField = $scope.record;
      for (var i = 0, l = fieldParts.length; i < l; i++) {
        if (!arrayField[fieldParts[i]]) {
          if (i === l - 1) {
            arrayField[fieldParts[i]] = [];
          } else {
            arrayField[fieldParts[i]] = {};
          }
        }
        arrayField = arrayField[fieldParts[i]];
      }
      arrayField.push({});
      $scope.setFormDirty($event);
    };

    $scope.remove = function (fieldName, value, $event) {
      // Remove an element from an array
      var fieldParts = fieldName.split('.');
      var arrayField = $scope.record;
      for (var i = 0, l = fieldParts.length; i < l; i++) {
        arrayField = arrayField[fieldParts[i]];
      }
      arrayField.splice(value, 1);
      $scope.setFormDirty($event);
    };

    // Split a field name into the next level and all following levels
    function splitFieldName(aFieldName) {
      var nesting = aFieldName.split('.'),
        result = [nesting[0]];

      if (nesting.length > 1) {
        result.push(nesting.slice(1).join('.'));
      }

      return result;
    }

    function updateObject(aFieldName, portion, fn) {
      var fieldDetails = splitFieldName(aFieldName);

      if (fieldDetails.length > 1) {
        updateArrayOrObject(fieldDetails[1], portion[fieldDetails[0]], fn);
      } else if (portion[fieldDetails[0]]) {
        var theValue = portion[fieldDetails[0]];
        portion[fieldDetails[0]] = fn(theValue);
      }
    }

    function updateArrayOrObject(aFieldName, portion, fn) {
      if (portion !== undefined) {
        if (_.isArray(portion)) {
          for (var i = 0; i < portion.length; i++) {
            updateObject(aFieldName, portion[i], fn);
          }
        } else {
          updateObject(aFieldName, portion, fn);
        }
      }
    }


    var simpleArrayNeedsX = function (aSchema) {
      var result = false;
      if (aSchema.type === 'text') {
        result = true;
      } else if ((aSchema.type === 'select') && !aSchema.ids) {
        result = true;
      }
      return result;
    };

// Convert foreign keys into their display for selects
// Called when the model is read and when the lookups are read

// No support for nested schemas here as it is called from convertToAngularModel which does that
    function convertForeignKeys(schemaElement, input, values, ids) {
      if (schemaElement.array) {
        var returnArray = [];
        for (var j = 0; j < input.length; j++) {
          returnArray.push({x: convertIdToListValue(input[j], ids, values, schemaElement.name)});
        }
        return returnArray;
      } else if (schemaElement.select2) {
        return {id: input, text: convertIdToListValue(input, ids, values, schemaElement.name)};
      } else {
        return convertIdToListValue(input, ids, values, schemaElement.name);
      }
    }

// Convert ids into their foreign keys
// Called when saving the model

// No support for nested schemas here as it is called from convertToMongoModel which does that
    function convertToForeignKeys(schemaElement, input, values, ids) {
      if (schemaElement.array) {
        var returnArray = [];
        for (var j = 0; j < input.length; j++) {
          returnArray.push(convertListValueToId(input[j], values, ids, schemaElement.name));
        }
        return returnArray;
      } else {
        return convertListValueToId(input, values, ids, schemaElement.name);
      }
    }

    var convertIdToListValue = function (id, idsArray, valuesArray, fname) {
      var index = idsArray.indexOf(id);
      if (index === -1) {
        throw new Error('convertIdToListValue: Invalid data - id ' + id + ' not found in ' + idsArray + ' processing ' + fname);
      }
      return valuesArray[index];
    };

    var convertListValueToId = function (value, valuesArray, idsArray, fname) {
      var textToConvert = _.isObject(value) ? (value.x || value.text) : value;
      if (textToConvert && textToConvert.match(/^[0-9a-f]{24}$/)) {
        return textToConvert;  // a plugin probably added this
      } else {
        var index = valuesArray.indexOf(textToConvert);
        if (index === -1) {
          throw new Error('convertListValueToId: Invalid data - value ' + textToConvert + ' not found in ' + valuesArray + ' processing ' + fname);
        }
        return idsArray[index];
      }
    };

    var setUpSelectOptions = function (lookupCollection, schemaElement) {
      var optionsList = $scope[schemaElement.options] = [];
      var idList = $scope[schemaElement.ids] = [];

      $http.get('/api/schema/' + lookupCollection, {cache: true}).success(function (data) {
        var listInstructions = [];
        handleSchema('Lookup ' + lookupCollection, data, null, listInstructions, '', false);
        $http.get( $scope.apiHost + '/api/' + lookupCollection, {cache: true}).success(function (data) {
          if (data) {
            for (var i = 0; i < data.length; i++) {
              var option = '';
              for (var j = 0; j < listInstructions.length; j++) {
                option += data[i][listInstructions[j].name] + ' ';
              }
              option = option.trim();
              var pos = _.sortedIndex(optionsList, option);
              // handle dupes (ideally people will use unique indexes to stop them but...)
              if (optionsList[pos] === option) {
                option = option + '    (' + data[i]._id + ')';
                pos = _.sortedIndex(optionsList, option);
              }
              optionsList.splice(pos, 0, option);
              idList.splice(pos, 0, data[i]._id);
            }
            updateRecordWithLookupValues(schemaElement);
          }
        });
      });
    };

    var updateRecordWithLookupValues = function (schemaElement) {
      // Update the master and the record with the lookup values
      if (!$scope.topLevelFormName || $scope[$scope.topLevelFormName].$pristine) {
        updateObject(schemaElement.name, master, function (value) {
          return convertForeignKeys(schemaElement, value, $scope[suffixCleanId(schemaElement, 'Options')], $scope[suffixCleanId(schemaElement, '_ids')]);
        });
        // TODO This needs a rethink - it is a quick workaround.  See https://trello.com/c/q3B7Usll
        if (master[schemaElement.name]) {
          $scope.record[schemaElement.name] = master[schemaElement.name];
        }
      }
    };

// Open a select2 control from the appended search button
    $scope.openSelect2 = function (ev) {
      $('#' + $(ev.currentTarget).data('select2-open')).select2('open');
    };

    $scope.toJSON = function (obj) {
      return JSON.stringify(obj, null, 2);
    };

    $scope.baseSchema = function () {
      return ($scope.tabs.length ? $scope.tabs : $scope.formSchema);
    };

  }
])
.controller('SaveChangesModalCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  $scope.yes = function () {
    $modalInstance.close(true);
  };
  $scope.no = function () {
    $modalInstance.close(false);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
.factory('$stateParse', [function () {

  var lastObject = {};

  return function (state) {
    if (state.current && state.current.name) {
      lastObject = {newRecord: false};
      lastObject.modelName = state.params.model;
      if (state.current.name === 'model::list') {
        lastObject = {index: true};
        lastObject.modelName = state.params.model;
      } else if (state.current.name === 'model::edit') {
        lastObject.id = state.params.id;
      } else if (state.current.name === 'model::new') {
        lastObject.newRecord = true;
      } else if (state.current.name === 'model::analyse') {
        lastObject.analyse = true;
      }
    }
    return lastObject;
  };
}])
.factory('$data', [function () {
  var sharedData = {
    record: {},
    disableFunctions: {},
    dataEventFunctions: {}
  };
  return sharedData;

}])
.filter('titleCase', [function () {
  return function (str, stripSpaces) {
    if(str) {
      var value = str
        .replace(/(_|\.)/g, ' ')                       // replace underscores and dots with spaces
        .replace(/[A-Z]/g, ' $&').trim()               // precede replace caps with a space
        .replace(/\w\S*/g, function (txt) {            // capitalise first letter of word
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      if (stripSpaces) {
        value = value.replace(/\s/g, '');
      } else {
        // lose double spaces
        value = value.replace(/\s{2,}/g, ' ');
      }
      return value;
    } else {
      return '';
    }
  };
}]);
