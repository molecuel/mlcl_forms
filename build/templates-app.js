angular.module('templates-app', ['form/form.tpl.html', 'form/input.tpl.html', 'plugins/field_input/field_input_text.tpl.html']);

angular.module("form/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("form/form.tpl.html",
    "<form name=\"baseForm\" class=\"form-horizontal compact novalidate\"></form>\n" +
    "");
}]);

angular.module("form/input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("form/input.tpl.html",
    "<input id=\"{{id}}\" name=\"{{name}}\"  class=\"{{classes}}\" msd-elastic=\"{{elastic}}\"/> \n" +
    "");
}]);

angular.module("plugins/field_input/field_input_text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_input/field_input_text.tpl.html",
    "<div class=\"control-group\">\n" +
    "  <label class=\"control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"controls\">\n" +
    "    <input model=\"{{attributes.model}}\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\">\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
