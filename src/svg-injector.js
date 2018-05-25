import injectElement from './inject-element'

/**
 * :NOTE: We are using get/setAttribute with SVG because the SVG DOM spec
 * differs from HTML DOM and can return other unexpected object types when
 * trying to directly access svg properties. ex: "className" returns a
 * SVGAnimatedString with the class value found in the "baseVal" property,
 * instead of simple string like with HTML Elements.
 */
const SVGInjector = (elements, options = {}, done) => {
  const evalScripts = options.evalScripts || 'always'
  const pngFallback = options.pngFallback || false
  const eachCallback = options.each

  if (elements.length !== undefined) {
    let elementsLoaded = 0
    Array.prototype.forEach.call(elements, element => {
      injectElement(element, evalScripts, pngFallback, svg => {
        if (eachCallback && typeof eachCallback === 'function')
          eachCallback(svg)
        if (done && elements.length === ++elementsLoaded) done(elementsLoaded)
      })
    })
  } else {
    if (elements) {
      injectElement(elements, evalScripts, pngFallback, svg => {
        if (eachCallback && typeof eachCallback === 'function')
          eachCallback(svg)
        if (done) done(1)
        elements = null
      })
    } else {
      if (done) done(0)
    }
  }
}

export default SVGInjector
