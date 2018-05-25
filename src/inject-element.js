import loadSvg from './load-svg'
import uniqueClasses from './unique-classes'

const svgNamespace = 'http://www.w3.org/2000/svg'
const xlinkNamespace = 'http://www.w3.org/1999/xlink'
const injectedElements = []
const ranScripts = {} // Script running status

let injectCount = 0

// Inject a single element
const injectElement = (el, evalScripts, pngFallback, callback) => {
  const hasSvgSupport = document.implementation.hasFeature(
    'http://www.w3.org/TR/SVG11/feature#BasicStructure',
    '1.1'
  )
  const imgUrl = el.getAttribute('data-src') || el.getAttribute('src')

  // We can only inject SVG.
  if (!/\.svg/i.test(imgUrl)) {
    callback('Attempted to inject a file with a non-svg extension: ' + imgUrl)
    return
  }

  // If we don't have SVG support try to fall back to a png,
  // either defined per-element via data-fallback or data-png,
  // or globally via the pngFallback directory setting
  if (!hasSvgSupport) {
    const perElementFallback =
      el.getAttribute('data-fallback') || el.getAttribute('data-png')

    // Per-element specific PNG fallback defined, so use that
    if (perElementFallback) {
      el.setAttribute('src', perElementFallback)
      callback(null)
    } else if (pngFallback) {
      // Global PNG fallback directoriy defined, use the same-named PNG
      el.setAttribute(
        'src',
        pngFallback +
          '/' +
          imgUrl
            .split('/')
            .pop()
            .replace('.svg', '.png')
      )
      callback(null)
    } else {
      // um...
      callback(
        'This browser does not support SVG and no PNG fallback was defined.'
      )
    }

    return
  }

  // Make sure we aren't already in the process of injecting this element to
  // avoid a race condition if multiple injections for the same element are run.
  // :NOTE: Using indexOf() only _after_ we check for SVG support and bail,
  // so no need for IE8 indexOf() polyfill
  if (injectedElements.indexOf(el) !== -1) {
    return
  }

  // Remember the request to inject this element, in case other injection
  // calls are also trying to replace this element before we finish
  injectedElements.push(el)

  // Try to avoid loading the orginal image src if possible.
  el.setAttribute('src', '')

  // Load it up
  loadSvg(imgUrl, function(svg) {
    if (typeof svg === 'undefined' || typeof svg === 'string') {
      callback(svg)
      return false
    }

    var imgId = el.getAttribute('id')
    if (imgId) {
      svg.setAttribute('id', imgId)
    }

    var imgTitle = el.getAttribute('title')
    if (imgTitle) {
      svg.setAttribute('title', imgTitle)
    }

    // Concat the SVG classes + 'injected-svg' + the img classes
    var classMerge = []
      .concat(
        svg.getAttribute('class') || [],
        'injected-svg',
        el.getAttribute('class') || []
      )
      .join(' ')
    svg.setAttribute('class', uniqueClasses(classMerge))

    var imgStyle = el.getAttribute('style')
    if (imgStyle) {
      svg.setAttribute('style', imgStyle)
    }

    // Copy all the data elements to the svg
    var imgData = [].filter.call(el.attributes, function(at) {
      return /^data-\w[\w\-]*$/.test(at.name)
    })
    Array.prototype.forEach.call(imgData, function(dataAttr) {
      if (dataAttr.name && dataAttr.value) {
        svg.setAttribute(dataAttr.name, dataAttr.value)
      }
    })

    // Make sure any internally referenced clipPath ids and their
    // clip-path references are unique.
    //
    // This addresses the issue of having multiple instances of the
    // same SVG on a page and only the first clipPath id is referenced.
    //
    // Browsers often shortcut the SVG Spec and don't use clipPaths
    // contained in parent elements that are hidden, so if you hide the first
    // SVG instance on the page, then all other instances lose their clipping.
    // Reference: https://bugzilla.mozilla.org/show_bug.cgi?id=376027

    // Handle all defs elements that have iri capable attributes as defined by w3c: http://www.w3.org/TR/SVG/linking.html#processingIRI
    // Mapping IRI addressable elements to the properties that can reference them:
    var iriElementsAndProperties = {
      clipPath: ['clip-path'],
      'color-profile': ['color-profile'],
      cursor: ['cursor'],
      filter: ['filter'],
      linearGradient: ['fill', 'stroke'],
      marker: ['marker', 'marker-start', 'marker-mid', 'marker-end'],
      mask: ['mask'],
      pattern: ['fill', 'stroke'],
      radialGradient: ['fill', 'stroke']
    }

    var element, elementDefs, properties, currentId, newId
    Object.keys(iriElementsAndProperties).forEach(function(key) {
      element = key
      properties = iriElementsAndProperties[key]

      elementDefs = svg.querySelectorAll('defs ' + element + '[id]')
      for (var i = 0, elementsLen = elementDefs.length; i < elementsLen; i++) {
        currentId = elementDefs[i].id
        newId = currentId + '-' + injectCount

        // All of the properties that can reference this element type
        var referencingElements
        Array.prototype.forEach.call(properties, function(property) {
          // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
          referencingElements = svg.querySelectorAll(
            '[' + property + '*="' + currentId + '"]'
          )
          for (
            var j = 0, referencingElementLen = referencingElements.length;
            j < referencingElementLen;
            j++
          ) {
            referencingElements[j].setAttribute(property, 'url(#' + newId + ')')
          }
        })

        var allLinks = svg.querySelectorAll('[*|href]')
        var links = []
        for (var k = 0, allLinksLen = allLinks.length; k < allLinksLen; k++) {
          if (
            allLinks[k].getAttributeNS(xlinkNamespace, 'href').toString() ===
            '#' + elementDefs[i].id
          ) {
            links.push(allLinks[k])
          }
        }
        for (var l = 0, linksLen = links.length; l < linksLen; l++) {
          links[l].setAttributeNS(xlinkNamespace, 'href', '#' + newId)
        }

        elementDefs[i].id = newId
      }
    })

    // Remove any unwanted/invalid namespaces that might have been added by SVG editing tools
    svg.removeAttribute('xmlns:a')

    // Post page load injected SVGs don't automatically have their script
    // elements run, so we'll need to make that happen, if requested

    // Find then prune the scripts
    var scripts = svg.querySelectorAll('script')
    var scriptsToEval = []
    var script, scriptType

    for (var k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
      scriptType = scripts[k].getAttribute('type')

      // Only process javascript types.
      // SVG defaults to 'application/ecmascript' for unset types
      if (
        !scriptType ||
        scriptType === 'application/ecmascript' ||
        scriptType === 'application/javascript'
      ) {
        // innerText for IE, textContent for other browsers
        script = scripts[k].innerText || scripts[k].textContent

        // Stash
        scriptsToEval.push(script)

        // Tidy up and remove the script element since we don't need it anymore
        svg.removeChild(scripts[k])
      }
    }

    // Run/Eval the scripts if needed
    if (
      scriptsToEval.length > 0 &&
      (evalScripts === 'always' ||
        (evalScripts === 'once' && !ranScripts[imgUrl]))
    ) {
      for (
        var l = 0, scriptsToEvalLen = scriptsToEval.length;
        l < scriptsToEvalLen;
        l++
      ) {
        // :NOTE: Yup, this is a form of eval, but it is being used to eval code
        // the caller has explictely asked to be loaded, and the code is in a caller
        // defined SVG file... not raw user input.
        //
        // Also, the code is evaluated in a closure and not in the global scope.
        // If you need to put something in global scope, use 'window'
        new Function(scriptsToEval[l])(window) // jshint ignore:line
      }

      // Remember we already ran scripts for this svg
      ranScripts[imgUrl] = true
    }

    // :WORKAROUND:
    // IE doesn't evaluate <style> tags in SVGs that are dynamically added to the page.
    // This trick will trigger IE to read and use any existing SVG <style> tags.
    //
    // Reference: https://github.com/iconic/SVGInjector/issues/23
    var styleTags = svg.querySelectorAll('style')
    Array.prototype.forEach.call(styleTags, function(styleTag) {
      styleTag.textContent += ''
    })

    svg.setAttribute('xmlns', svgNamespace)
    svg.setAttribute('xmlns:xlink', xlinkNamespace)

    // Replace the image with the svg
    el.parentNode.replaceChild(svg, el)

    // Now that we no longer need it, drop references
    // to the original element so it can be GC'd
    delete injectedElements[injectedElements.indexOf(el)]
    el = null

    // Increment the injected count
    injectCount++

    callback(svg)
  })
}

export default injectElement
