var mlcl_forms_services = angular.module('mlcl_forms.services');

/**
 * Service which provides convert functions for the readed record
 */
mlcl_forms_services.factory('recordService', function() {
  return function() {
    var self = this;
    // Convert {_id:'xxx', array:['item 1'], lookup:'012abcde'} to {_id:'xxx', array:[{x:'item 1'}], lookup:'List description for 012abcde'}
    // Which is what we need for use in the browser
    this.convertToAngularModel = function (schema, anObject, prefixLength) {
    /*  var resultFunction = function resultFunction(array) {
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
          var thisField = $scope.getListData(anObject, fieldname);
          if (schema[i].array && simpleArrayNeedsX(schema[i]) && thisField) {
            for (var k = 0; k < thisField.length; k++) {
              thisField[k] = {x: thisField[k] };
            }
          }

          // Convert {lookup:'012abcde'} to {lookup:'List description for 012abcde'}
          var idList = $scope[suffixCleanId(schema[i], '_ids')];
          if (idList && idList.length > 0 && anObject[fieldname]) {
            anObject[fieldname] = convertForeignKeys(schema[i], anObject[fieldname], $scope[suffixCleanId(schema[i], 'Options')], idList);
          } else if (schema[i].select2 && !schema[i].select2.fngAjax) {
            if (anObject[fieldname]) {
              // Might as well use the function we set up to do the search
              $scope[schema[i].select2.s2query].query({
                term: anObject[fieldname],
                callback: resultFunction
              });
            }
          }
        }
      }*/
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
  };
});
