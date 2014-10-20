angular.module('mlcl_forms-templates-app', ['form/form.tpl.html', 'form/input.tpl.html', 'list/list.tpl.html', 'list/listheader.tpl.html', 'plugins/field_array_fieldset_blockmanager/field_array_fieldset_blockmanager.tpl.html', 'plugins/field_array_fieldset_file/field_array_fieldset_file.tpl.html', 'plugins/field_array_fieldset_jsonedit/field_array_fieldset_jsonedit.tpl.html', 'plugins/field_array_objectid/field_array_objectid.tpl.html', 'plugins/field_boolean/field_boolean.tpl.html', 'plugins/field_date/field_date.tpl.html', 'plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html', 'plugins/field_number/field_number.tpl.html', 'plugins/field_object_file_file/field_object_file_file.tpl.html', 'plugins/field_object_jsonedit/field_object_jsonedit.tpl.html', 'plugins/field_objectid/field_objectid.tpl.html', 'plugins/field_objectid_file/field_objectid_file.tpl.html', 'plugins/field_string/field_string_text.tpl.html', 'plugins/field_string_password/field_string_password.tpl.html', 'plugins/field_string_radio/field_string_radio.tpl.html', 'plugins/field_string_select/field_string_select.tpl.html', 'plugins/field_string_select_typeahead/field_string_select_typeahead.tpl.html', 'plugins/field_string_textarea/field_string_textarea.tpl.html', 'plugins/field_string_textarea_wysiwyg/field_string_textarea_wysiwyg.tpl.html', 'plugins/field_string_url/field_string_url.tpl.html', 'widget/collection/edit.tpl.html', 'widget/collection/view.tpl.html', 'widget/html/edit.tpl.html', 'widget/html/view.tpl.html', 'widget/image/edit.tpl.html', 'widget/image/view.tpl.html', 'widget/lt/edit.tpl.html', 'widget/lt/view.tpl.html', 'widget/menu/edit.tpl.html', 'widget/menu/view.tpl.html', 'widget/video/edit.tpl.html', 'widget/video/view.tpl.html', 'widget/widgetcontainer.tpl.html', 'widget/widgetmanager.tpl.html', 'widgetDirectives/selectObjectid/selectObjectid.tpl.html', 'widgetDirectives/selectObjectids/selectObjectid.tpl.html']);

angular.module("form/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("form/form.tpl.html",
    "<form name=\"baseForm\" class=\"form-horizontal\"></form>\n" +
    "");
}]);

angular.module("form/input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("form/input.tpl.html",
    "<input id=\"{{id}}\" name=\"{{name}}\"  class=\"{{classes}}\" msd-elastic=\"{{elastic}}\"/> \n" +
    "");
}]);

angular.module("list/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/list.tpl.html",
    "<!-- <button ng-click=\"tableParams.reload()\" class=\"btn btn-default\">Reload</button>\n" +
    "<button ng-click=\"tableParams.sorting({})\" class=\"btn btn-default\">Clear sorting</button> -->\n" +
    "<div class=\"clearfix\"></div>\n" +
    "<div loading-container=\"tableParams.settings().$loading\">\n" +
    "  <table ng-table=\"tableParams\" template-header=\"list/listheader.tpl.html\" show-filter=\"true\" class=\"table\">\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"element in $data\">\n" +
    "          <td  ng-repeat=\"column in columns\" sortable=\"column.field\">\n" +
    "            {{element[column.field]}}\n" +
    "          </td>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n" +
    "\n" +
    "<!-- <table class=\"table table-hover data-table\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th ng-repeat=\"listfield in listfields\">{{listfield.field}}</th>\n" +
    "    </tr\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"element in elements\">\n" +
    "      <td ng-repeat=\"listfield in listfields\">{{element[listfield.field]}}</td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "\n" +
    "<ul class=\"pagination\">\n" +
    "  <li><span>&laquo;</span></li>\n" +
    "  <li ng-repeat=\"mypage in pagearray\" ng-click=\"changepage(mypage)\"><span>{{mypage}}</span></li>\n" +
    "</ul>\n" +
    "-->\n" +
    "");
}]);

angular.module("list/listheader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/listheader.tpl.html",
    "<tr>\n" +
    "  <th colspan=\"3\">\n" +
    "     <input class=\"form-control\" type=\"text\" ng-model=\"filterinput.myfilter\" placeholder=\"Filter\"  />\n" +
    "  </th>\n" +
    "</tr>\n" +
    "<tr>\n" +
    "    <th ng-repeat=\"column in columns\"\n" +
    "        class=\"text-center sortable\" ng-class=\"{\n" +
    "            'sort-asc': tableParams.isSortBy(column.field, 'asc'),\n" +
    "            'sort-desc': tableParams.isSortBy(column.field, 'desc')\n" +
    "          }\"\n" +
    "        ng-click=\"tableParams.sorting(column.field, tableParams.isSortBy(column.field, 'asc') ? 'desc' : 'asc')\">\n" +
    "        {{column.field}}\n" +
    "    </th>\n" +
    "    <!--<th>Columns:{{columns.length}}</th>-->\n" +
    "</tr>\n" +
    "");
}]);

angular.module("plugins/field_array_fieldset_blockmanager/field_array_fieldset_blockmanager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_array_fieldset_blockmanager/field_array_fieldset_blockmanager.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <widget-manager widgetmodel=\"model\"></widget-manager>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_array_fieldset_file/field_array_fieldset_file.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_array_fieldset_file/field_array_fieldset_file.tpl.html",
    "<div class=\"form-group form-download\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <div flow-init=\"{target: fieldInfo.uploadPath }\" flow-files-submitted=\"$flow.upload()\">\n" +
    "      <div class=\"drop\" flow-drop=\"\" ng-class=\"dropClass\">\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\">Upload File<input type=\"file\" multiple=\"multiple\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\" flow-directory=\"\" ng-show=\"$flow.supportDirectory\">Upload Folder<input type=\"file\" multiple=\"multiple\" webkitdirectory=\"webkitdirectory\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <b>OR</b>\n" +
    "        Drag And Drop your file here\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div class=\"well\">\n" +
    "        <a class=\"btn btn-small btn-success\" ng-click=\"$flow.resume()\">Resume all</a>\n" +
    "        <a class=\"btn btn-small btn-danger\" ng-click=\"$flow.pause()\">Pause all</a>\n" +
    "        <a class=\"btn btn-small btn-info\" ng-click=\"$flow.cancel()\">Cancel all</a>\n" +
    "        <span class=\"label label-info ng-binding\">Total Size: {{fullsize}} bytes</span>\n" +
    "      </div>\n" +
    "      <div class=\"progress col-md-12\" ng-show=\"$flow.isUploading() || $flow.paused\">\n" +
    "        <material-linear-progress mode=\"determinate\" ng-value=\"$flow.progress() * 100\"></material-linear-progress>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-repeat=\"file in model\" class=\"col-md-12 transfer-box ng-scope ng-binding\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "\n" +
    "          <div class=\"filelabel col-md-12\">\n" +
    "            <a href=\"{{fieldInfo.apihost + fileInfo[file.file].url}}\" target=\"_blank\">{{fileInfo[file.file].filename}}</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 btn-group\">\n" +
    "          <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.pause()\" ng-show=\"!file.paused && file.isUploading()\">\n" +
    "            Pause\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.resume()\" ng-show=\"file.paused\">\n" +
    "            Resume\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-danger\" ng-click=\"remove(file)\">\n" +
    "            Remove\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-info ng-hide\" ng-click=\"file.retry()\" ng-show=\"file.error\">\n" +
    "            Retry\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-6\">\n" +
    "          <input class=\"form-control\" placeholder=\"File title\" type=\"text\" ng-model=\"file.title\"></input>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"file.download\">\n" +
    "            Force download\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_array_fieldset_jsonedit/field_array_fieldset_jsonedit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_array_fieldset_jsonedit/field_array_fieldset_jsonedit.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <div class=\"jsonView\" >\n" +
    "      <json child=\"model\" type=\"array\" default-collapsed=\"true\"></json>\n" +
    "    </div>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_array_objectid/field_array_objectid.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_array_objectid/field_array_objectid.tpl.html",
    "<div class=\"form-group form-download\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "      <select-objectids class=\"col-md-6\" selected=\"selectedObject\" widgetmodel=\"mod\" fieldinfo=\"fieldInfo\"></select-objectids>\n" +
    "      <div class=\"buttonlist col-md-6\">\n" +
    "        <material-button class=\"material-button-fab fab-sm\" ng-click=\"addToSet()\" tabindex=\"-1\" aria-label=\"\">\n" +
    "          <i class=\"fa fa-plus\"></i>\n" +
    "        </material-button>\n" +
    "      </div>\n" +
    "      <p class=\"col-md-12 help-block\">{{fieldInfo.options.help || 'Drag and Drop elements for the correct position'}}</p>\n" +
    "      <ul ui-sortable class=\"list-group\" ng-model=\"renderedData\">\n" +
    "        <li class=\"col-md-12 list-group-item\" ng-repeat=\"item in renderedData\">\n" +
    "          <div class=\"col-md-6\">{{ item.text }}</div>\n" +
    "          <div class=\"col-md-6 buttonlist\">\n" +
    "            <material-button class=\"material-button-fab fab-sm\" ng-click=\"removeFromSet(item)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "              <i class=\"fa fa-minus\"></i>\n" +
    "            </material-button>\n" +
    "          </div>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_boolean/field_boolean.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_boolean/field_boolean.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\">\n" +
    "    {{fieldInfo.label}}\n" +
    "  </label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <material-switch ng-model=\"model\" aria-label=\"fieldInfo.label\" aria-label=\"{{fieldInfo.label}}\">\n" +
    "    </material-switch>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_date/field_date.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_date/field_date.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <input type=\"text\" class=\"form-control\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_date_datetime_datepicker/field_date_datetime_datepicker.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
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
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <input type=\"text\" class=\"form-control\" ng-attr-min=\"{{attributes.min}}\" ng-attr-max=\"{{attributes.max}}\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_object_file_file/field_object_file_file.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_object_file_file/field_object_file_file.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <div flow-init=\"{target: fieldInfo.uploadPath }\" flow-name=\"$parent.flow\" flow-files-submitted=\"$flow.upload()\">\n" +
    "      <div class=\"drop\" flow-drop=\"\" ng-class=\"dropClass\">\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\">Upload File<input type=\"file\" multiple=\"multiple\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\" flow-directory=\"\" ng-show=\"$flow.supportDirectory\">Upload Folder<input type=\"file\" multiple=\"multiple\" webkitdirectory=\"webkitdirectory\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <b>OR</b>\n" +
    "        Drag And Drop your file here\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div class=\"well\">\n" +
    "        <a class=\"btn btn-small btn-success\" ng-click=\"$flow.resume()\">Resume all</a>\n" +
    "        <a class=\"btn btn-small btn-danger\" ng-click=\"$flow.pause()\">Pause all</a>\n" +
    "        <a class=\"btn btn-small btn-info\" ng-click=\"$flow.cancel()\">Cancel all</a>\n" +
    "        <span class=\"label label-info ng-binding\">Total Size: 0bytes</span>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-repeat=\"file in $flow.files\" class=\"transfer-box ng-scope\">\n" +
    "        {{fileInfo[file.file].name}}\n" +
    "        <div class=\"progress\" ng-class=\"{active: file.isUploading()}\">\n" +
    "          <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" ng-style=\"{width: (file.progress() * 100) + '%'}\" style=\"width: 100%;\">\n" +
    "            <span class=\"sr-only ng-binding\">1% Complete</span>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"btn-group\">\n" +
    "          <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.pause()\" ng-show=\"!file.paused &amp;&amp; file.isUploading()\">\n" +
    "            Pause\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.resume()\" ng-show=\"file.paused\">\n" +
    "            Resume\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-danger\" ng-click=\"file.cancel()\">\n" +
    "            Remove\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-info ng-hide\" ng-click=\"file.retry()\" ng-show=\"file.error\">\n" +
    "            Retry\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_object_jsonedit/field_object_jsonedit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_object_jsonedit/field_object_jsonedit.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <div class=\"jsonView\" >\n" +
    "      <json child=\"model\" type=\"object\" default-collapsed=\"true\"></json>\n" +
    "    </div>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_objectid/field_objectid.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_objectid/field_objectid.tpl.html",
    "<div class=\"form-group form-download\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "      <ui-select ng-model=\"selectedObject.selected\"\n" +
    "             theme=\"select2\"\n" +
    "             ng-disabled=\"disabled\"\n" +
    "             reset-search-input=\"false\"\n" +
    "             style=\"width: 300px;\">\n" +
    "    <ui-select-match placeholder=\"Find ... \">{{$select.selected.text}}</ui-select-match>\n" +
    "    <ui-select-choices repeat=\"selectedObject in foundObjects track by $index\"\n" +
    "             refresh=\"refreshObjects($select.search)\"\n" +
    "             refresh-delay=\"0\">\n" +
    "      <div ng-bind-html=\"selectedObject.text | highlight: $select.search\"></div>\n" +
    "    </ui-select-choices>\n" +
    "  </ui-select>\n" +
    "\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_objectid_file/field_objectid_file.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_objectid_file/field_objectid_file.tpl.html",
    "<div class=\"form-group form-download\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <div flow-init=\"{target: fieldInfo.uploadPath }\" flow-files-submitted=\"$flow.upload()\">\n" +
    "      <div class=\"drop\" flow-drop=\"\" ng-class=\"dropClass\">\n" +
    "        <span class=\"btn btn-default\" flow-btn=\"\">Upload File<input type=\"file\" multiple=\"multiple\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "        <b>OR</b>\n" +
    "        Drag And Drop your file here\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div class=\"well\">\n" +
    "        <a class=\"btn btn-small btn-success\" ng-click=\"$flow.resume()\">Resume all</a>\n" +
    "        <a class=\"btn btn-small btn-danger\" ng-click=\"$flow.pause()\">Pause all</a>\n" +
    "        <a class=\"btn btn-small btn-info\" ng-click=\"$flow.cancel()\">Cancel all</a>\n" +
    "        <span class=\"label label-info ng-binding\">Total Size: {{fullsize}} bytes</span>\n" +
    "      </div>\n" +
    "      <div class=\"progress col-md-12\" ng-show=\"$flow.isUploading() || $flow.paused\">\n" +
    "        <material-linear-progress mode=\"determinate\" ng-value=\"$flow.progress() * 100\"></material-linear-progress>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"col-md-12\" ng-if=\"model\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "          <div class=\"filelabel col-md-12\">\n" +
    "            <a href=\"{{fieldInfo.apihost + fileInfo[model].url}}\" target=\"_blank\">{{fileInfo[model].filename}}</a>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 btn-group\">\n" +
    "          <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.pause()\" ng-show=\"!file.paused && file.isUploading()\">\n" +
    "            Pause\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.resume()\" ng-show=\"file.paused\">\n" +
    "            Resume\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-danger\" ng-click=\"remove(model)\">\n" +
    "            Remove\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-xs btn-info ng-hide\" ng-click=\"file.retry()\" ng-show=\"file.error\">\n" +
    "            Retry\n" +
    "          </a>\n" +
    "        </div>\n" +
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
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <input class=\"form-control\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_password/field_string_password.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_password/field_string_password.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <input class=\"form-control\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"password\" placeholder=\"{{attributes.placeholder}}\" class=\"input-xlarge\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\" />\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_radio/field_string_radio.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_radio/field_string_radio.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label {{radiotype}}\" for=\"{{attributes.nameString}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <label class=\"radio\" for=\"{{attributes.nameString}}\" ng-repeat=\"enum in fieldInfo.enum\">{{enum}}\n" +
    "      <input type=\"radio\" name=\"{{attributes.nameString}}\" id=\"{{attributes.id}}_{{enum}}\" value=\"{{enum}}\">\n" +
    "    </label>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_select/field_string_select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_select/field_string_select.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <select ng-model=\"model\" ng-options=\"enum for enum in fieldInfo.enum\">\n" +
    "      <option value=\"\">-- Select item --</option>\n" +
    "    </select>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_select_typeahead/field_string_select_typeahead.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_select_typeahead/field_string_select_typeahead.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <input type=\"text\" ng-model=\"model\" typeahead=\"myenum for myenum in fieldInfo.enum | filter:$viewValue | limitTo:8\" class=\"form-control\">\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_textarea/field_string_textarea.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_textarea/field_string_textarea.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <textarea class=\"form-control msd-elastic\" ng-model=\"model\" id=\"{{attributes.id}}\" name=\"{{attributes.name}}\" type=\"text\" placeholder=\"{{attributes.placeholder}}\" ng-required=\"{{attributes.required}}\" ng-readonly=\"{{attributes.readonly}}\"></textarea>\n" +
    "    <p class=\"help-block\">{{fieldInfo.help}}</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/field_string_textarea_wysiwyg/field_string_textarea_wysiwyg.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/field_string_textarea_wysiwyg/field_string_textarea_wysiwyg.tpl.html",
    "<div class=\"form-group\">\n" +
    "  <label class=\"col-md-2 control-label\" for=\"{{attributes.name}}\">{{fieldInfo.label}}</label>\n" +
    "  <div class=\"col-md-10\">\n" +
    "    <div contenteditable=\"true\" ckeditor ng-model=\"model\"></div>\n" +
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

angular.module("widget/collection/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/collection/edit.tpl.html",
    "<tabset>\n" +
    "  <tab heading=\"Settings\" active=\"settingsActive\">\n" +
    "     <material-content>\n" +
    "       <material-input-group ng-disabled=\"isDisabled\">\n" +
    "         <label for=\"confTarget\">Region</label>\n" +
    "         <material-input id=\"confTarget\" ng-model=\"model.target\"></material-input>\n" +
    "       </material-input-group>\n" +
    "    </material-content>\n" +
    "  </tab>\n" +
    "  <tab heading=\"Editor\" active=\"editorActive\">\n" +
    "    <div class=\"jsonView\" >\n" +
    "      <json child=\"model.data\" type=\"object\" default-collapsed=\"true\"></json>\n" +
    "    </div>\n" +
    "  </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("widget/collection/view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/collection/view.tpl.html",
    "<div class=\"col-md-12 widgetview\">\n" +
    "  <i class=\"fa fa-html5 widgettypeicon\"></i>\n" +
    "  <div class=\"widget-button-group\">\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveUp(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-up\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveDown(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-down\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.edit(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-edit\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.settings(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-bars\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.remove(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-times\"></i>\n" +
    "    </material-button>\n" +
    "  </div>\n" +
    "  <div class=\"jsonView\" >\n" +
    "    <json child=\"model.data\" type=\"object\" default-collapsed=\"true\"></json>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/html/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/html/edit.tpl.html",
    "<tabset>\n" +
    "  <tab heading=\"Settings\" active=\"settingsActive\">\n" +
    "     <material-content>\n" +
    "       <material-input-group ng-disabled=\"isDisabled\">\n" +
    "         <label for=\"confTarget\">Region</label>\n" +
    "         <material-input id=\"confTarget\" ng-model=\"model.target\"></material-input>\n" +
    "       </material-input-group>\n" +
    "    </material-content>\n" +
    "  </tab>\n" +
    "  <tab heading=\"Editor\" active=\"editorActive\">\n" +
    "    <div class=\"richdiv\" contenteditable=\"true\" ckeditor ng-model=\"model.data.html\"></div>\n" +
    "  </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("widget/html/view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/html/view.tpl.html",
    "<div class=\"col-md-12 widgetview\">\n" +
    "  <i class=\"fa fa-html5 widgettypeicon\"></i>\n" +
    "  <div class=\"widget-button-group\">\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveUp(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-up\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveDown(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-down\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.edit(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-edit\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.settings(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-bars\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.remove(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-times\"></i>\n" +
    "    </material-button>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-12 richdiv\" contenteditable=\"true\" ckeditor ng-model=\"model.data.html\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/image/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/image/edit.tpl.html",
    "<tabset>\n" +
    "  <tab heading=\"Settings\" active=\"settingsActive\">\n" +
    "     <material-content>\n" +
    "       <material-input-group ng-disabled=\"isDisabled\">\n" +
    "         <label for=\"confTarget\">Region</label>\n" +
    "         <material-input id=\"confTarget\" ng-model=\"model.target\"></material-input>\n" +
    "       </material-input-group>\n" +
    "       <material-checkbox ng-model=\"model.data.settings.gallery\" aria-label=\"Gallery\" ng-true-value=\"true\" ng-false-value=\"false\">\n" +
    "        Gallery\n" +
    "       </material-checkbox>\n" +
    "     </material-content>\n" +
    "  </tab>\n" +
    "  <tab heading=\"Editor\" active=\"editorActive\">\n" +
    "    <div class=\"form-group form-download\">\n" +
    "      <div class=\"col-md-12\">\n" +
    "        <div flow-init=\"{target: uploadPath }\" flow-files-submitted=\"$flow.upload()\">\n" +
    "          <div class=\"drop\" flow-drop=\"\" ng-class=\"dropClass\" flow-attrs=\"{accept:'image/*'}\">\n" +
    "            <span class=\"btn btn-default\" flow-btn=\"\" flow-attrs=\"{accept:'image/*'}\">Upload File<input type=\"file\" multiple=\"multiple\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "            <span class=\"btn btn-default\" flow-btn=\"\" flow-attrs=\"{accept:'image/*'}\" flow-directory=\"\" ng-show=\"$flow.supportDirectory\">Upload Folder<input type=\"file\" multiple=\"multiple\" webkitdirectory=\"webkitdirectory\" style=\"visibility: hidden; position: absolute;\"></span>\n" +
    "            <b>OR</b>\n" +
    "            Drag And Drop your file here\n" +
    "          </div>\n" +
    "          <br>\n" +
    "          <div class=\"well\">\n" +
    "            <a class=\"btn btn-small btn-success\" ng-click=\"$flow.resume()\">Resume all</a>\n" +
    "            <a class=\"btn btn-small btn-danger\" ng-click=\"$flow.pause()\">Pause all</a>\n" +
    "            <a class=\"btn btn-small btn-info\" ng-click=\"$flow.cancel()\">Cancel all</a>\n" +
    "            <span class=\"label label-info ng-binding\">Total Size: {{fullsize}} bytes</span>\n" +
    "          </div>\n" +
    "          <div class=\"progress col-md-12\" ng-show=\"$flow.isUploading() || $flow.paused\">\n" +
    "            <material-linear-progress mode=\"determinate\" ng-value=\"$flow.progress() * 100\"></material-linear-progress>\n" +
    "          </div>\n" +
    "\n" +
    "          <div ng-repeat=\"file in model.data.images\" class=\"col-md-12 transfer-box\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "\n" +
    "              <div class=\"filelabel col-md-12\">\n" +
    "                <a href=\"{{apihost + fileInfo[file.file].url}}\" target=\"_blank\">{{fileInfo[file.file].filename}}</a>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 btn-group\">\n" +
    "              <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.pause()\" ng-show=\"!file.paused && file.isUploading()\">\n" +
    "                Pause\n" +
    "              </a>\n" +
    "              <a class=\"btn btn-xs btn-warning ng-hide\" ng-click=\"file.resume()\" ng-show=\"file.paused\">\n" +
    "                Resume\n" +
    "              </a>\n" +
    "              <a class=\"btn btn-xs btn-danger\" ng-click=\"remove(file)\">\n" +
    "                Remove\n" +
    "              </a>\n" +
    "              <a class=\"btn btn-xs btn-info ng-hide\" ng-click=\"file.retry()\" ng-show=\"file.error\">\n" +
    "                Retry\n" +
    "              </a>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-6\">\n" +
    "              <input class=\"form-control\" placeholder=\"File title\" type=\"text\" ng-model=\"file.title\"></input>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "              <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"file.download\">\n" +
    "                Force download\n" +
    "              </label>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "        <p class=\"help-block\">{{help}}</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("widget/image/view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/image/view.tpl.html",
    "<div class=\"col-md-12 widgetview\">\n" +
    "  <i class=\"fa fa-image widgettypeicon\"></i>\n" +
    "  <div class=\"widget-button-group\">\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveUp(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-up\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveDown(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-down\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.edit(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-edit\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.settings(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-bars\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.remove(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-times\"></i>\n" +
    "    </material-button>\n" +
    "  </div>\n" +
    "  <div class=\"col-md-12 richdiv\">\n" +
    "    <img ng-if=\"fileInfo[firstimage].url\" src=\"{{apiHost}}{{fileInfo[firstimage].url}}\"/>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/lt/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/lt/edit.tpl.html",
    "<tabset>\n" +
    "  <tab heading=\"Settings\" active=\"settingsActive\">\n" +
    "     <material-content>\n" +
    "       <material-input-group ng-disabled=\"isDisabled\">\n" +
    "         <label for=\"confTarget\">Region</label>\n" +
    "         <material-input id=\"confTarget\" ng-model=\"model.target\"></material-input>\n" +
    "       </material-input-group>\n" +
    "    </material-content>\n" +
    "  </tab>\n" +
    "  <tab heading=\"Editor\" active=\"editorActive\">\n" +
    "    <div class=\"richdiv\" contenteditable=\"true\" ckeditor ng-model=\"model.data.html\"></div>\n" +
    "  </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("widget/lt/view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/lt/view.tpl.html",
    "<div class=\"col-md-12 widgetview\">\n" +
    "  <i class=\"fa fa-html5 widgettypeicon\"></i>\n" +
    "  <div class=\"widget-button-group\">\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveUp(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-up\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveDown(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-down\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.edit(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-edit\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.settings(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-bars\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.remove(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-times\"></i>\n" +
    "    </material-button>\n" +
    "  </div>\n" +
    "  <div class=\"jsonView\" >\n" +
    "    <json child=\"model.data\" type=\"object\" default-collapsed=\"true\"></json>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/menu/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/menu/edit.tpl.html",
    "<tabset>\n" +
    "  <tab heading=\"Settings\" active=\"settingsActive\">\n" +
    "     <material-content>\n" +
    "       <material-input-group ng-disabled=\"isDisabled\">\n" +
    "         <label for=\"confTarget\">Region</label>\n" +
    "         <material-input id=\"confTarget\" ng-model=\"model.target\"></material-input>\n" +
    "       </material-input-group>\n" +
    "    </material-content>\n" +
    "  </tab>\n" +
    "  <tab heading=\"Editor\" active=\"editorActive\">\n" +
    "    <div class=\"jsonView\" >\n" +
    "      <json child=\"model.data\" type=\"object\" default-collapsed=\"true\"></json>\n" +
    "    </div>\n" +
    "  </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("widget/menu/view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/menu/view.tpl.html",
    "<div class=\"col-md-12 widgetview\">\n" +
    "  <i class=\"fa fa-html5 widgettypeicon\"></i>\n" +
    "  <div class=\"widget-button-group\">\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveUp(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-up\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveDown(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-down\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.edit(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-edit\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.settings(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-bars\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.remove(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-times\"></i>\n" +
    "    </material-button>\n" +
    "  </div>\n" +
    "  <div class=\"jsonView\" >\n" +
    "    <json child=\"model.data\" type=\"object\" default-collapsed=\"true\"></json>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/video/edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/video/edit.tpl.html",
    "<tabset>\n" +
    "  <tab heading=\"Settings\" active=\"settingsActive\">\n" +
    "     <material-content>\n" +
    "       <material-input-group ng-disabled=\"isDisabled\">\n" +
    "         <label for=\"confTarget\">Region</label>\n" +
    "         <material-input id=\"confTarget\" ng-model=\"model.target\"></material-input>\n" +
    "       </material-input-group>\n" +
    "    </material-content>\n" +
    "  </tab>\n" +
    "  <tab heading=\"Editor\" active=\"editorActive\">\n" +
    "    <material-input-group ng-disabled=\"isDisabled\">\n" +
    "      <label for=\"videoUrl\">Video URL:</label>\n" +
    "      <material-input id=\"videoUrl\" ng-model=\"model.data.video\"></material-input>\n" +
    "    </material-input-group>\n" +
    "  </tab>\n" +
    "</tabset>\n" +
    "");
}]);

angular.module("widget/video/view.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/video/view.tpl.html",
    "<div class=\"col-md-12 widgetview\">\n" +
    "  <i class=\"fa fa-video-camera widgettypeicon\"></i>\n" +
    "  <div class=\"widget-button-group\">\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveUp(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-up\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.moveDown(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-sort-down\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.edit(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-edit\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.settings(model, this)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-bars\"></i>\n" +
    "    </material-button>\n" +
    "    <material-button class=\"material-button-fab fab-sm\" ng-click=\"$parent.remove(model)\" tabindex=\"-1\" aria-label=\"\">\n" +
    "      <i class=\"fa fa-times\"></i>\n" +
    "    </material-button>\n" +
    "  </div>\n" +
    "  <iframe class=\"widgetvideoframe\" ng-if=\"trustvideourl\" src=\"{{trustvideourl}}\" />\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/widgetcontainer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/widgetcontainer.tpl.html",
    "<div class=\"col-md-12 widgetcontainer\">\n" +
    "{{model.type}}\n" +
    "</div>\n" +
    "");
}]);

angular.module("widget/widgetmanager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widget/widgetmanager.tpl.html",
    "<div class=\"col-md-12\">\n" +
    "  <material-button class=\"widgetButton\" ng-click=\"showSelectWidget()\"><i class=\"fa fa-plus\"></i> Add Widget</material-button>\n" +
    "  <div class=\"widgetPopup\" ng-show=\"showWidgetSelect\">\n" +
    "    <ul class=\"list-group widgetselectcontainer\">\n" +
    "      <li class=\"col-md-6 list-group-item addwidget\"><material-button ng-click=\"addWidget('html')\"><i class=\"fa fa-html5\"></i>HTML Widget</material-button></li>\n" +
    "      <li class=\"col-md-6 list-group-item addwidget\"><material-button ng-click=\"addWidget('image')\"><i class=\"fa fa-picture-o\"></i>Image Widget</material-button></li>\n" +
    "      <li class=\"col-md-6 list-group-item addwidget\"><material-button ng-click=\"addWidget('video')\"><i class=\"fa fa-video\"></i>Video Widget</material-button></li>\n" +
    "      <li class=\"col-md-6 list-group-item addwidget\"><material-button ng-click=\"addWidget('lt')\"><i class=\"fa fa-json\"></i>LT Widget</material-button></li>\n" +
    "      <li class=\"col-md-6 list-group-item addwidget\"><material-button ng-click=\"addWidget('collection')\"><i class=\"fa fa-json\"></i>Collection widget</material-button></li>\n" +
    "      <li class=\"col-md-6 list-group-item addwidget\"><material-button ng-click=\"addWidget('menu')\"><i class=\"fa fa-json\"></i>Menu Widget</material-button></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <widget-view-container ng-model=\"model\" widgetmodel=\"model\"></widget-view-container>\n" +
    "</div>\n" +
    "");
}]);

angular.module("widgetDirectives/selectObjectid/selectObjectid.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgetDirectives/selectObjectid/selectObjectid.tpl.html",
    "<ui-select ng-model=\"selectedObject.selected\"\n" +
    "       theme=\"select2\"\n" +
    "       ng-disabled=\"disabled\"\n" +
    "       reset-search-input=\"false\"\n" +
    "       style=\"width: 300px;\">\n" +
    "    <ui-select-match placeholder=\"Find ... \">{{$select.selected.text}}</ui-select-match>\n" +
    "    <ui-select-choices repeat=\"selectedObject in foundObjects track by $index\"\n" +
    "      refresh=\"refreshObjects($select.search)\"\n" +
    "      refresh-delay=\"0\">\n" +
    "    <div ng-bind-html=\"selectedObject.text | highlight: $select.search\"></div>\n" +
    "  </ui-select-choices>\n" +
    "</ui-select>\n" +
    "");
}]);

angular.module("widgetDirectives/selectObjectids/selectObjectid.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgetDirectives/selectObjectids/selectObjectid.tpl.html",
    "<ui-select multiple ng-model=\"selected.selected\" theme=\"select2\" ng-disabled=\"disabled\" style=\"width: 800px;\" reset-search-input=\"true\">\n" +
    "  <ui-select-match placeholder=\"Add items...\">{{$item.text}}</ui-select-match>\n" +
    "  <ui-select-choices repeat=\"item in foundObjects\"\n" +
    "  refresh=\"refreshObjects($select.search)\"\n" +
    "  refresh-delay=\"0\">\n" +
    "    <div ng-bind-html=\"item.text | highlight: $select.search\"></div>\n" +
    "    <small>\n" +
    "      {{item.text}}\n" +
    "    </small>\n" +
    "  </ui-select-choices>\n" +
    "</ui-select>\n" +
    "{{selectedObject}}\n" +
    "");
}]);
