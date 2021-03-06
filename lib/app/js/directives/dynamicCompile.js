'use strict'

angular.module('sgApp')
  .directive('dynamicCompile', ['$compile', '$parse', function($compile, $parse) {
    return {
      link: function(scope, element, attrs, controller) {
        var parsed = $parse(attrs.ngBindHtml);
        function getStringValue() { return (parsed(scope) || '').toString(); }
        // Recompile if the template changes
        scope.$watch(getStringValue, function() {
          $compile(element, null, 0)(scope);
        });
      }
    };
  }]);
