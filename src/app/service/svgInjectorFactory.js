
angular
  .module('svginjector')
  .factory('svgInjectorFactory', ['$window', 'injectorOptions', function(win, injectorOptions) {
    console.log('new injector');
    return new SVGInjector(injectorOptions);
    //return injector;
  }]);
