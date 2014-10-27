var mlcl_forms_services = angular.module('mlcl_forms.services');

/**
 * Service which provides convert functions for the readed record
 */
mlcl_forms_services.factory('recordService', function(schemaService) {
  return function() {
    var self = this;
    this.schemaService = schemaService;

    //

    /**
     * anonymous function - description
     *
     * Convert {_id:'xxx', array:['item 1'], lookup:'012abcde'} to {_id:'xxx', array:[{x:'item 1'}], lookup:'List description for 012abcde'}
     * Which is what we need for use in the browser
     *
     * @param  {type} schema       description
     * @param  {type} anObject     description
     * @param  {type} prefixLength description
     * @return {type}              description
     */
    this.convertToAngularModel = function (schema, anObject, prefixLength) {
      var resultFunction = function resultFunction(array) {
        if (array.results.length > 0) {
          anObject[fieldname] = array.results[0];
        }
      };
      for (var i = 0; i < schema.length; i++) {
        var fieldname = schema[i].name.slice(prefixLength);
        if (schema[i].schema) {
          if (anObject[fieldname]) {
            for (var j = 0; j < anObject[fieldname].length; j++) {
              anObject[fieldname][j] = self.convertToAngularModel(schema[i].schema, anObject[fieldname][j], prefixLength + 1 + fieldname.length);
            }
          }
        } else {

          // Convert {array:['item 1']} to {array:[{x:'item 1'}]}
          var thisField = self.getListData(anObject, fieldname);
          if (schema[i].array && self.simpleArrayNeedsX(schema[i]) && thisField) {
            for (var k = 0; k < thisField.length; k++) {
              thisField[k] = {x: thisField[k] };
            }
          }

          // Convert {lookup:'012abcde'} to {lookup:'List description for 012abcde'}
          var idList = schemaService[self.suffixCleanId(schema[i], '_ids')];
          if (idList && idList.length > 0 && anObject[fieldname]) {
            anObject[fieldname] = self.convertForeignKeys(schema[i], anObject[fieldname], schemaService[self.suffixCleanId(schema[i], 'Options')], idList);
          } else if (schema[i].select2 && !schema[i].select2.fngAjax) {
            if (anObject[fieldname]) {
              // Might as well use the function we set up to do the search
              schemaService[schema[i].select2.s2query].query({
                term: anObject[fieldname],
                callback: resultFunction
              });
            }
          }
        }
      }
      return anObject;
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


    /**
     * convertToMongoModel - Convert the angular model to an mongoose API compatible one
     *
     * @param  {type} schema       description
     * @param  {type} anObject     description
     * @param  {type} prefixLength description
     * @return {type}              description
     */
    this.convertToMongoModel = function convertToMongoModel(schema, anObject, prefixLength) {
      var updateResultFunction = function updateResultFunction(value) {
        return convertToForeignKeys(schema[i], value, $scope[self.suffixCleanId(schema[i], 'Options')], idList);
      };

      for (var i = 0; i < schema.length; i++) {
        var fieldname = schema[i].name.slice(prefixLength);
        var thisField = self.getListData(anObject, fieldname);
        
        if (schema[i].schema) {
          if (thisField) {
            for (var j = 0; j < thisField.length; j++) {
              thisField[j] = self.convertToMongoModel(schema[i].schema, thisField[j], prefixLength + 1 + fieldname.length);
            }
          }
        } else {

          // Convert {array:[{x:'item 1'}]} to {array:['item 1']}
          if (schema[i].array && simpleArrayNeedsX(schema[i]) && thisField) {
            for (var k = 0; k < thisField.length; k++) {
              thisField[k] = thisField[k].x;
            }
          }

          // Convert {lookup:'List description for 012abcde'} to {lookup:'012abcde'}
          var idList = schemaService[self.suffixCleanId(schema[i], '_ids')];
          if (idList && idList.length > 0) {
            updateObject(fieldname, anObject, updateResultFunction);
          } else if (schema[i].select2) {
            var lookup = self.getData(anObject, fieldname, null);
            if (schema[i].select2.fngAjax) {
              if (lookup && lookup.id) {
                self.setData(anObject, fieldname, null, lookup.id);
              }
            } else {
              if (lookup) {
                self.setData(anObject, fieldname, null, lookup.text);
              } else {
                self.setData(anObject, fieldname, null, undefined);
              }
            }
          }

        }
      }
      return anObject;
    };

    /**
     * getListData - description
     *
     * @param  {type} record    description
     * @param  {type} fieldName description
     * @return {type}           description
     */
    this.getListData = function getListData(record, fieldName) {
      var nests = fieldName.split('.');
      for (var i = 0; i < nests.length; i++) {
        if (record !== undefined) {
          record = record[nests[i]];
        }
      }
      if (record && self.schemaService && self.schemaService.select2List && self.schemaService.select2List.indexOf(nests[i - 1]) !== -1) {
        record = record.text;
      }
      if (record === undefined) {
        record = '';
      }
      return record;
    };

    /**
     * getData - description
     *
     * @param  {type} object    description
     * @param  {type} fieldname description
     * @param  {type} element   description
     * @return {type}           description
     */
    this.getData = function getData(object, fieldname, element) {
      var leafData = self.walkTree(object, fieldname, element);
      return (leafData.lastObject && leafData.key) ? leafData.lastObject[leafData.key] : undefined;
    };



    /**
     * setData - description
     *
     * @param  {type} object    description
     * @param  {type} fieldname description
     * @param  {type} element   description
     * @param  {type} value     description
     * @return {type}           description
     */
    this.setData = function setData(object, fieldname, element, value) {
      var leafData = self.walkTree(object, fieldname, element);
      leafData.lastObject[leafData.key] = value;
    };


  /**
   * convertForeignKeys - description
   *
   * @param  {type} schemaElement description
   * @param  {type} input         description
   * @param  {type} values        description
   * @param  {type} ids           description
   * @return {type}               description
   */
  this.convertForeignKeys = function convertForeignKeys(schemaElement, input, values, ids) {
    if (schemaElement.array) {
      var returnArray = [];
      for (var j = 0; j < input.length; j++) {
        returnArray.push({x: self.convertIdToListValue(input[j], ids, values, schemaElement.name)});
      }
      return returnArray;
    } else if (schemaElement.select2) {
      return {id: input, text: self.convertIdToListValue(input, ids, values, schemaElement.name)};
    } else {
      return self.convertIdToListValue(input, ids, values, schemaElement.name);
    }
  };

    /**
     * convertToForeignKeys - description
     *
     * @param  {type} schemaElement description
     * @param  {type} input         description
     * @param  {type} values        description
     * @param  {type} ids           description
     * @return {type}               description
     *
     * Convert ids into their foreign keys
     * Called when saving the model
     *
     * No support for nested schemas here as it is called from convertToMongoModel which does that
     *
     */
    this.convertToForeignKeys = function convertToForeignKeys(schemaElement, input, values, ids) {
      if (schemaElement.array) {
        var returnArray = [];
        for (var j = 0; j < input.length; j++) {
          returnArray.push(self.convertListValueToId(input[j], values, ids, schemaElement.name));
        }
        return returnArray;
      } else {
        return self.convertListValueToId(input, values, ids, schemaElement.name);
      }
    };

    /**
     * convertIdToListValue - description
     *
     * @param  {type} id          description
     * @param  {type} idsArray    description
     * @param  {type} valuesArray description
     * @param  {type} fname       description
     * @return {type}             description
     */
    this.convertIdToListValue = function convertIdToListValue(id, idsArray, valuesArray, fname) {
      var index = idsArray.indexOf(id);
      if (index === -1) {
        throw new Error('convertIdToListValue: Invalid data - id ' + id + ' not found in ' + idsArray + ' processing ' + fname);
      }
      return valuesArray[index];
    };


    /**
     * convertListValueToId - description
     *
     * @param  {type} value       description
     * @param  {type} valuesArray description
     * @param  {type} idsArray    description
     * @param  {type} fname       description
     * @return {type}             description
     */
    this.convertListValueToId = function convertListValueToId(value, valuesArray, idsArray, fname) {
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

    /**
     * walkTree - description
     *
     * @param  {type} object    description
     * @param  {type} fieldname description
     * @param  {type} element   description
     * @return {type}           description
     */
    this.walkTree = function walkTree(object, fieldname, element) {
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

    this.simpleArrayNeedsX = function simpleArrayNeedsX(aSchema) {
      var result = false;
      if (aSchema.type === 'text') {
        result = true;
      } else if ((aSchema.type === 'select') && !aSchema.ids) {
        result = true;
      }
      return result;
    };
  }; // end instance function
});
