
angular
  .module('svginjector', [])
  .value('injectorOptions', {
    //forceFallbacks:     true, // -> enable to test png-fallbacks in svg-capable browsers
    evalScripts: 'once',
    pngFallback: '.', // -> path to ths png fallback relative to the svg
    findSymbolByView: true, // only inject the visible symbol and not the whole svg
    fallbackClassName: [], // optional function -> function(element, symbolId) {},
    removeStylesClass: 'icon',
    keepStylesClass: 'keep-styles',
    removeAllStyles: false
    //spritesheetURL:     'spritesheet/svg-spritesheet.svg'
  });
