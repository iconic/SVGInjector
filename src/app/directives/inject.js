angular
  .module('svginjector')
  .directive('svg', ['svgInjectorFactory', function(svgInjectorFactory) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      //templateUrl: 'my-dialog.html',
      link: function (scope, element) {
        svgInjectorFactory.inject(element[0]);
      }
    };
  }]);
