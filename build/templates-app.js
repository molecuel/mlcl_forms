angular.module('templates-app', ['form/form.tpl.html', 'form/input.tpl.html', 'plugins/field_boolean/field_boolean.tpl.html', 'plugins/field_date/field_date.tpl.html', 'plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html', 'plugins/field_number/field_number.tpl.html', 'plugins/field_object_file_file/field_object_file_file.tpl.html', 'plugins/field_string/field_string_text.tpl.html', 'plugins/field_string_textarea/field_string_textarea.tpl.html', 'plugins/field_string_url/field_string_url.tpl.html']);

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
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <input ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"checkbox\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" value=\"1\"/>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_date/field_date.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_date/field_date.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <input type=\"datetime-local\" class=\"form-control\" ng-attr-min=\"{{attributes.min}}\" ng-attr-max=\"{{attributes.max}}\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <input ng-model=\"model\" type=\"text\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\"\n" +
    "      class=\"form-control\" datepicker-popup=\"MM-dd-yyyy\" datepicker-append-to-body=\"true\"\n" +
    "      is-open=\"data.isOpen\" ng-click=\"data.isOpen = true\" />\n" +
    "    <br>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_number/field_number.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_number/field_number.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <input type=\"text\" class=\"form-control\" ng-attr-min=\"{{attributes.min}}\" ng-attr-max=\"{{attributes.max}}\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_object_file_file/field_object_file_file.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_object_file_file/field_object_file_file.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <div flow-init=\"\" flow-files-submitted=\"$flow.upload()\" class=\"ng-scope\">\n" +
    "      <div class=\"drop\" flow-drop=\"\" ng-class=\"dropClass\">\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\">Upload File<input type=\"file\" multiple=\"multiple\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\" flow-directory=\"\" ng-show=\"$flow.supportDirectory\">Upload Folder<input type=\"file\" multiple=\"multiple\" webkitdirectory=\"webkitdirectory\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <b>OR</b>\n" +
    "        Drag And Drop your file here\n" +
    "      </div>\n" +
    "\n" +
    "      <br>\n" +
    "\n" +
    "      <div class=\"well\">\n" +
    "        <a class=\"btn btn-small btn-success\" ng-click=\"$flow.resume()\">Resume all</a>\n" +
    "        <a class=\"btn btn-small btn-danger\" ng-click=\"$flow.pause()\">Pause all</a>\n" +
    "        <a class=\"btn btn-small btn-info\" ng-click=\"$flow.cancel()\">Cancel all</a>\n" +
    "        <span class=\"label label-info ng-binding\">Total Size: 0bytes</span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div>\n" +
    "\n" +
    "        <!-- ngRepeat: file in $flow.files -->\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string/field_string_text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string/field_string_text.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <input class=\"form-control\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_textarea/field_string_textarea.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_textarea/field_string_textarea.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <textarea class=\"form-control msd-elastic\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\"></textarea>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_url/field_string_url.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_url/field_string_url.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-3 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-6\">\n" +
    "    <input ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"url\" placeholder=\"{{attributes.placeholder}}\" class=\"form-control\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" >\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
