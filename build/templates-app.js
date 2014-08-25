angular.module('templates-app', ['form/form.tpl.html', 'form/input.tpl.html', 'plugins/field_boolean/field_boolean.tpl.html', 'plugins/field_number/field_number.tpl.html', 'plugins/field_string/field_string_text.tpl.html', 'plugins/field_string_textarea/field_string_textarea.tpl.html', 'plugins/field_string_url/field_string_url.tpl.html']);

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

angular.module("plugins/field_boolean/field_boolean.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_boolean/field_boolean.tpl.html",
    "<div class=\"control-group\">\n" +
    "  <label class=\"control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"controls\">\n" +
    "    <input model=\"{{attributes.model}}\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"checkbox\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" value=\"1\"/>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_number/field_number.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_number/field_number.tpl.html",
    "<div class=\"control-group\">\n" +
    "  <label class=\"control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"controls\">\n" +
    "    <input type=\"text\" ng-attr-min=\"{{attributes.min}}\" ng-attr-max=\"{{attributes.max}}\" model=\"{{attributes.model}}\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string/field_string_text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string/field_string_text.tpl.html",
    "<div class=\"control-group\">\n" +
    "  <label class=\"control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"controls\">\n" +
    "    <input model=\"{{attributes.model}}\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_textarea/field_string_textarea.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_textarea/field_string_textarea.tpl.html",
    "<div class=\"control-group\">\n" +
    "  <label class=\"control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"controls\">\n" +
    "    <textarea model=\"{{attributes.model}}\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\"></textarea>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_url/field_string_url.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_url/field_string_url.tpl.html",
    "<div class=\"control-group\">\n" +
    "  <label class=\"control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"controls\">\n" +
    "    <input model=\"{{attributes.model}}\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"url\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" >\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);