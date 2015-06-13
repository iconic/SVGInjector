
angular
  .module('svginjector')
  .directive('inject', ['svgInjectorFactory', function(svgInjectorFactory) {
    return {
      scope: {},
      //templateUrl: 'my-dialog.html',
      link: function (scope, element) {
        svgInjectorFactory.injectElement(element[0]);
      }
    };
  }]);
