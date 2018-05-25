(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.SVGInjector = factory());
}(this, (function () { 'use strict';

  var cloneSvg = function cloneSvg(sourceSvg) {
    return sourceSvg.cloneNode(true);
  };

  var svgCache = {};

  var requestQueue = [];
  var queueRequest = function queueRequest(url, callback) {
    requestQueue[url] = requestQueue[url] || [];
    requestQueue[url].push(callback);
  };
  var processRequestQueue = function processRequestQueue(url) {
    for (var i = 0, len = requestQueue[url].length; i < len; i++) {

      (function (index) {
        setTimeout(function () {
          requestQueue[url][index](cloneSvg(svgCache[url]));
        }, 0);
      })(i);
      /* jshint loopfunc: false */

    }
  };

  var loadSvg = function loadSvg(url, callback) {
    var isLocal = window.location.protocol === 'file:';

    if (svgCache[url] !== undefined) {
      if (svgCache[url] instanceof SVGSVGElement) {
        // We already have it in cache, so use it
        callback(cloneSvg(svgCache[url]));
      } else {
        // We don't have it in cache yet, but we are loading it, so queue this request
        queueRequest(url, callback);
      }
    } else {
      if (!window.XMLHttpRequest) {
        callback('Browser does not support XMLHttpRequest');
        return false;
      } // Seed the cache to indicate we are loading this URL already


      svgCache[url] = {};
      queueRequest(url, callback);
      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function () {
        // readyState 4 = complete
        if (httpRequest.readyState === 4) {
          // Handle status
          if (httpRequest.status === 404 || httpRequest.responseXML === null) {
            callback('Unable to load SVG file: ' + url);
            if (isLocal) callback('Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.');
            callback();
            return false;
          } // 200 success from server, or 0 when using file:// protocol locally


          if (httpRequest.status === 200 || isLocal && httpRequest.status === 0) {
            /* globals Document */
            if (httpRequest.responseXML instanceof Document) {
              // Cache it
              svgCache[url] = httpRequest.responseXML.documentElement;
            }
            /* globals -Document */
            // IE9 doesn't create a responseXML Document object from loaded SVG,
            // and throws a "DOM Exception: HIERARCHY_REQUEST_ERR (3)" error when injected.
            //
            // So, we'll just create our own manually via the DOMParser using
            // the the raw XML responseText.
            //
            // :NOTE: IE8 and older doesn't have DOMParser, but they can't do SVG either, so...
            else if (DOMParser && DOMParser instanceof Function) {
                var xmlDoc;

                try {
                  var parser = new DOMParser();
                  xmlDoc = parser.parseFromString(httpRequest.responseText, 'text/xml');
                } catch (e) {
                  xmlDoc = undefined;
                }

                if (!xmlDoc || xmlDoc.getElementsByTagName('parsererror').length) {
                  callback('Unable to parse SVG file: ' + url);
                  return false;
                } else {
                  // Cache it
                  svgCache[url] = xmlDoc.documentElement;
                }
              } // We've loaded a new asset, so process any requests waiting for it


            processRequestQueue(url);
          } else {
            callback('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
            return false;
          }
        }
      };

      httpRequest.open('GET', url); // Treat and parse the response as XML, even if the
      // server sends us a different mimetype

      if (httpRequest.overrideMimeType) httpRequest.overrideMimeType('text/xml');
      httpRequest.send();
    }
  };

  var uniqueClasses = function uniqueClasses(list) {
    list = list.split(' ');
    var hash = {};
    var i = list.length;
    var out = [];

    while (i--) {
      if (!hash.hasOwnProperty(list[i])) {
        hash[list[i]] = 1;
        out.unshift(list[i]);
      }
    }

    return out.join(' ');
  };

  var svgNamespace = 'http://www.w3.org/2000/svg';
  var xlinkNamespace = 'http://www.w3.org/1999/xlink';
  var injectedElements = [];
  var ranScripts = {}; // Script running status

  var injectCount = 0; // Inject a single element

  var injectElement = function injectElement(el, evalScripts, pngFallback, callback) {
    var hasSvgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
    var imgUrl = el.getAttribute('data-src') || el.getAttribute('src'); // We can only inject SVG.

    if (!/\.svg/i.test(imgUrl)) {
      callback('Attempted to inject a file with a non-svg extension: ' + imgUrl);
      return;
    } // If we don't have SVG support try to fall back to a png,
    // either defined per-element via data-fallback or data-png,
    // or globally via the pngFallback directory setting


    if (!hasSvgSupport) {
      var perElementFallback = el.getAttribute('data-fallback') || el.getAttribute('data-png'); // Per-element specific PNG fallback defined, so use that

      if (perElementFallback) {
        el.setAttribute('src', perElementFallback);
        callback(null);
      } else if (pngFallback) {
        // Global PNG fallback directoriy defined, use the same-named PNG
        el.setAttribute('src', pngFallback + '/' + imgUrl.split('/').pop().replace('.svg', '.png'));
        callback(null);
      } else {
        // um...
        callback('This browser does not support SVG and no PNG fallback was defined.');
      }

      return;
    } // Make sure we aren't already in the process of injecting this element to
    // avoid a race condition if multiple injections for the same element are run.
    // :NOTE: Using indexOf() only _after_ we check for SVG support and bail,
    // so no need for IE8 indexOf() polyfill


    if (injectedElements.indexOf(el) !== -1) {
      return;
    } // Remember the request to inject this element, in case other injection
    // calls are also trying to replace this element before we finish


    injectedElements.push(el); // Try to avoid loading the orginal image src if possible.

    el.setAttribute('src', ''); // Load it up

    loadSvg(imgUrl, function (svg) {
      if (typeof svg === 'undefined' || typeof svg === 'string') {
        callback(svg);
        return false;
      }

      var imgId = el.getAttribute('id');

      if (imgId) {
        svg.setAttribute('id', imgId);
      }

      var imgTitle = el.getAttribute('title');

      if (imgTitle) {
        svg.setAttribute('title', imgTitle);
      } // Concat the SVG classes + 'injected-svg' + the img classes


      var classMerge = [].concat(svg.getAttribute('class') || [], 'injected-svg', el.getAttribute('class') || []).join(' ');
      svg.setAttribute('class', uniqueClasses(classMerge));
      var imgStyle = el.getAttribute('style');

      if (imgStyle) {
        svg.setAttribute('style', imgStyle);
      } // Copy all the data elements to the svg


      var imgData = [].filter.call(el.attributes, function (at) {
        return /^data-\w[\w\-]*$/.test(at.name);
      });
      Array.prototype.forEach.call(imgData, function (dataAttr) {
        if (dataAttr.name && dataAttr.value) {
          svg.setAttribute(dataAttr.name, dataAttr.value);
        }
      }); // Make sure any internally referenced clipPath ids and their
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
      };
      var element, elementDefs, properties, currentId, newId;
      Object.keys(iriElementsAndProperties).forEach(function (key) {
        element = key;
        properties = iriElementsAndProperties[key];
        elementDefs = svg.querySelectorAll('defs ' + element + '[id]');

        for (var i = 0, elementsLen = elementDefs.length; i < elementsLen; i++) {
          currentId = elementDefs[i].id;
          newId = currentId + '-' + injectCount; // All of the properties that can reference this element type

          var referencingElements;
          Array.prototype.forEach.call(properties, function (property) {
            // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
            referencingElements = svg.querySelectorAll('[' + property + '*="' + currentId + '"]');

            for (var j = 0, referencingElementLen = referencingElements.length; j < referencingElementLen; j++) {
              referencingElements[j].setAttribute(property, 'url(#' + newId + ')');
            }
          });
          var allLinks = svg.querySelectorAll('[*|href]');
          var links = [];

          for (var k = 0, allLinksLen = allLinks.length; k < allLinksLen; k++) {
            if (allLinks[k].getAttributeNS(xlinkNamespace, 'href').toString() === '#' + elementDefs[i].id) {
              links.push(allLinks[k]);
            }
          }

          for (var l = 0, linksLen = links.length; l < linksLen; l++) {
            links[l].setAttributeNS(xlinkNamespace, 'href', '#' + newId);
          }

          elementDefs[i].id = newId;
        }
      }); // Remove any unwanted/invalid namespaces that might have been added by SVG editing tools

      svg.removeAttribute('xmlns:a'); // Post page load injected SVGs don't automatically have their script
      // elements run, so we'll need to make that happen, if requested
      // Find then prune the scripts

      var scripts = svg.querySelectorAll('script');
      var scriptsToEval = [];
      var script, scriptType;

      for (var k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
        scriptType = scripts[k].getAttribute('type'); // Only process javascript types.
        // SVG defaults to 'application/ecmascript' for unset types

        if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript') {
          // innerText for IE, textContent for other browsers
          script = scripts[k].innerText || scripts[k].textContent; // Stash

          scriptsToEval.push(script); // Tidy up and remove the script element since we don't need it anymore

          svg.removeChild(scripts[k]);
        }
      } // Run/Eval the scripts if needed


      if (scriptsToEval.length > 0 && (evalScripts === 'always' || evalScripts === 'once' && !ranScripts[imgUrl])) {
        for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {
          // :NOTE: Yup, this is a form of eval, but it is being used to eval code
          // the caller has explictely asked to be loaded, and the code is in a caller
          // defined SVG file... not raw user input.
          //
          // Also, the code is evaluated in a closure and not in the global scope.
          // If you need to put something in global scope, use 'window'
          new Function(scriptsToEval[l])(window); // jshint ignore:line
        } // Remember we already ran scripts for this svg


        ranScripts[imgUrl] = true;
      } // :WORKAROUND:
      // IE doesn't evaluate <style> tags in SVGs that are dynamically added to the page.
      // This trick will trigger IE to read and use any existing SVG <style> tags.
      //
      // Reference: https://github.com/iconic/SVGInjector/issues/23


      var styleTags = svg.querySelectorAll('style');
      Array.prototype.forEach.call(styleTags, function (styleTag) {
        styleTag.textContent += '';
      });
      svg.setAttribute('xmlns', svgNamespace);
      svg.setAttribute('xmlns:xlink', xlinkNamespace); // Replace the image with the svg

      el.parentNode.replaceChild(svg, el); // Now that we no longer need it, drop references
      // to the original element so it can be GC'd

      delete injectedElements[injectedElements.indexOf(el)];
      el = null; // Increment the injected count

      injectCount++;
      callback(svg);
    });
  };

  /**
   * :NOTE: We are using get/setAttribute with SVG because the SVG DOM spec
   * differs from HTML DOM and can return other unexpected object types when
   * trying to directly access svg properties. ex: "className" returns a
   * SVGAnimatedString with the class value found in the "baseVal" property,
   * instead of simple string like with HTML Elements.
   */

  var SVGInjector = function SVGInjector(elements, options, done) {
    if (options === void 0) {
      options = {};
    }

    var evalScripts = options.evalScripts || 'always';
    var pngFallback = options.pngFallback || false;
    var eachCallback = options.each;

    if (elements.length !== undefined) {
      var elementsLoaded = 0;
      Array.prototype.forEach.call(elements, function (element) {
        injectElement(element, evalScripts, pngFallback, function (svg) {
          if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
          if (done && elements.length === ++elementsLoaded) done(elementsLoaded);
        });
      });
    } else {
      if (elements) {
        injectElement(elements, evalScripts, pngFallback, function (svg) {
          if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
          if (done) done(1);
          elements = null;
        });
      } else {
        if (done) done(0);
      }
    }
  };

  return SVGInjector;

})));
