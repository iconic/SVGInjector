angular
  .module('svginjector')
  .factory('svgInjectorFactory', ['injectorOptions', function(injectorOptions) {
    console.log('new injector');
    return new SVGInjector(injectorOptions);
  }]);
