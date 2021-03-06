'use strict';

angular.module('sgApp')
  .directive('sgDesign', ['Variables', function(Variables) {
    return {
      replace: true,
      restrict: 'A',
      templateUrl: 'views/partials/design.html',
      link: function(scope) {
        scope.showRelated = true;

        scope.$watch('currentReference.section', function(newVal, oldVal) {
          scope.relatedVariables = scope.currentReference.section.variables
        });

        scope.saveVariables = function() {
          Variables.saveVariables();
        };

        scope.resetLocal = function() {
          Variables.resetLocal();
        }

        scope.isColor = function(value) {
          if (/^(#|rgb)/.test(value)) return true;
          return false;
        }
      }
    };
  }]);
