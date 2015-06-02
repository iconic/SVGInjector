/**
 * SVGInjector v1.1.3-RC - Fast, caching, dynamic inline SVG DOM injection library
 * https://github.com/iconic/SVGInjector
 *
 * Copyright (c) 2014 Waybury <hello@waybury.com>
 * @license MIT
 */

(function (window, document) {

  'use strict';

  // Constants
  var svgNS = 'http://www.w3.org/2000/svg';
  var xlinkNS = 'http://www.w3.org/1999/xlink';
  var defaultSpriteClassName = 'sprite';
  var defaultSpriteClassIdName = defaultSpriteClassName + '--';

  var spriteClassName = defaultSpriteClassName;
  var spriteClassIdName = defaultSpriteClassIdName;

  var defaultFallbackClassNames = [spriteClassIdName + '%s', spriteClassName];
  var defaultRemoveStylesClassName = 'icon';


  // Environment
  var isLocal = window.location.protocol === 'file:';
  var hasSvgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
  var onlyInjectVisiblePart, removeStylesClass, keepStylesClass, fallbackClassName,
      prefixStyleTags, removeAllStyles, spritesheetURL, prefixFragIdClass;




  function uniqueClasses(list) {
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
  }

  function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  }

  function isArray(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  function svgElemSetClassName(el, newClassNames){
    var curClasses = el.getAttribute('class');
    curClasses = curClasses ? curClasses : '';

    if(isArray(newClassNames)) {
      newClassNames = newClassNames.join(' ');
    }

    newClassNames = curClasses + ' ' + newClassNames;

    el.setAttribute('class', uniqueClasses(newClassNames));
  }

  /**
   * cache (or polyfill for <= IE8) Array.forEach()
   * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
   */
  var forEach = Array.prototype.forEach || function (fn, scope) {
    if (this === void 0 || this === null || typeof fn !== 'function') {
      throw new TypeError();
    }

    /* jshint bitwise: false */
    var i, len = this.length >>> 0;
    /* jshint bitwise: true */

    for (i = 0; i < len; ++i) {
      if (i in this) {
        fn.call(scope, this[i], i, this);
      }
    }
  };

  function setFallbackClassNames(element, symbolId, classNames) {
    var className =  (typeof classNames === 'undefined') ? defaultFallbackClassNames : classNames.slice(0);

    // replace %s by symbolId
    forEach.call(
      className,
      function(curClassName, idx) {
        className[idx] = curClassName.replace('%s', symbolId);
      }
    );

    svgElemSetClassName(element, className);
  }

  function removeFallbackClassNames(element, symbolId, fallbackClassNames) {
    fallbackClassNames =  (typeof fallbackClassNames === 'undefined') ? defaultFallbackClassNames.slice(0) : fallbackClassNames.slice(0);

    var curClassNames = element.getAttribute('class');
    if(curClassNames) {
      // replace %s by symbolId
      forEach.call(
        fallbackClassNames,
        function(curClassName, idx) {
          curClassName = curClassName.replace('%s', symbolId);
          if( curClassNames.indexOf(curClassName) >= 0 ){
            console.log('remove class ' + curClassName);
            curClassNames = curClassNames.replace(curClassName, '');
          }

        }
      );

      element.setAttribute('class', uniqueClasses(curClassNames));
    }

  }


  // SVG Cache
  var svgCache = {};

  var injectCount = 0;
  var injectedElements = [];

  // Request Queue
  var requestQueue = [];

  // Script running status
  var ranScripts = {};

  var copyAttributes = function (svgElemSource, svgElemTarget, attributesToIgnore) {
    var curAttr;
    if (typeof attributesToIgnore === 'undefined') { attributesToIgnore = ['id', 'viewBox']; }

    for(var i=0; i<svgElemSource.attributes.length; i++) {
      curAttr = svgElemSource.attributes.item(i);
      if (attributesToIgnore.indexOf(curAttr.name) < 0) {
        svgElemTarget.setAttribute(curAttr.name, curAttr.value);
      }
    }
  };

  var cloneSymbolAsSVG = function(svgSymbol) {
    var svg = document.createElementNS(svgNS, 'svg');
    forEach.call(svgSymbol.childNodes, function(child){

      svg.appendChild(child.cloneNode(true));

    });
    copyAttributes(svgSymbol, svg);
    return svg;
  };

  var doPrefixStyleTags = function(styleTag, injectCount, svg){
    var srcArr = svg.getAttribute('data-src').split('#');
    if(srcArr.length > 1) {

      var origPrefixClassName = srcArr[1];
      var regex = new RegExp('\\.' + origPrefixClassName + ' ', 'g');
      var newPrefixClassName = origPrefixClassName + '-' + injectCount;

      styleTag.textContent = styleTag.textContent.replace(regex, '.' + newPrefixClassName + ' ');
      svg.setAttribute('class', (svg.getAttribute('class') + ' ' + newPrefixClassName));
    }
  };

  var getClassList = function(svgToCheck) {
    var curClassAttr = svgToCheck.getAttribute('class');
    return (curClassAttr) ? curClassAttr.split(' '): [];
  };

  var getSpriteIdFromClass = function(element) {
    var classes = getClassList(element);
    console.log(classes);
    var id = '';
    forEach.call(classes, function (curClass) {
      console.log(curClass);
      if(curClass.indexOf(spriteClassIdName) >= 0) {
        id = curClass.replace(spriteClassIdName, '');
        console.log('class with prefix ' + spriteClassIdName + ' found. id: ' + id);
      }
    });
    //console.error('no class with prefix ' + spriteClassIdName + ' found');
    return id;
  };

  var cloneSvg = function(sourceSvg, fragId) {

    var svgElem,
        newSVG,
        viewBox,
        viewBoxAttr,
        symbolAttributesToFind,
        curClassList,
        setViewboxOnNewSVG = false,
        symbolElem = null;

    if(fragId === undefined){
      return sourceSvg.cloneNode(true);
    }
    else {
      svgElem = sourceSvg.getElementById(fragId);
      if(!svgElem){
        console.warn(fragId + ' not found in svg', sourceSvg);
        return;
      }

      viewBoxAttr = svgElem.getAttribute('viewBox');
      viewBox = viewBoxAttr.split(' ');

      if (svgElem instanceof SVGSymbolElement) {

        newSVG = cloneSymbolAsSVG(svgElem);
        setViewboxOnNewSVG = true;

      }
      else if (svgElem instanceof SVGViewElement) {
        symbolElem = null;
        if (onlyInjectVisiblePart) {
          var selector = '*[width="' + viewBox[2] + '"][height="'+viewBox[3]+'"]';

          symbolAttributesToFind = {};
          if (Math.abs(viewBox[0]) > 0) {
            symbolAttributesToFind.x = viewBox[0];
            selector += '[x="' + viewBox[0] + '"]';
          }
          if (Math.abs(viewBox[1]) > 0) {
            symbolAttributesToFind.y = viewBox[1];
            selector += '[y="' + viewBox[1] + '"]';
          }
          symbolElem = sourceSvg.querySelector(selector);
        }
        if (symbolElem && (symbolElem instanceof SVGSVGElement)) {
          newSVG = symbolElem.cloneNode(true);

          for (var prop in symbolAttributesToFind) {
            if (prop !== 'width' && prop !== 'height') {
              newSVG.removeAttribute(prop);
            }
          }
        }
        else if(symbolElem && (symbolElem instanceof SVGUseElement)) {
          console.log('referenced view shows a SVGUseElement');
          var referencedSymbol = sourceSvg.getElementById(
              symbolElem.getAttributeNS(xlinkNS, 'href').substr(1)
          );
          newSVG = cloneSymbolAsSVG(referencedSymbol);
          viewBoxAttr = referencedSymbol.getAttribute('viewBox');
          viewBox = viewBoxAttr.split(' ');
          setViewboxOnNewSVG = true;
        }
        else {
          console.info(
            ((onlyInjectVisiblePart) ? 'symbol referenced via view' + fragId + ' not found' : 'option.onlyInjectVisiblePart: false') + ' -> clone complete svg!'
          );
          setViewboxOnNewSVG = true;
          newSVG = sourceSvg.cloneNode(true);

        }
      }

      if (setViewboxOnNewSVG) {
        newSVG.setAttribute('viewBox', viewBox.join(' '));
        newSVG.setAttribute('width', viewBox[2]+'px');
        newSVG.setAttribute('height', viewBox[3]+'px');
      }

      //curClassAttr = newSVG.getAttribute('class');
      curClassList = getClassList(newSVG);
      var fragIdClassName = prefixFragIdClass + fragId;
      if (curClassList.indexOf(fragIdClassName)<0) {
        curClassList.push(fragIdClassName);
        newSVG.setAttribute('class', curClassList.join(' '));
      }
      return newSVG;
    }

  };

  var queueRequest = function (callback, fileName, fragId) {
    requestQueue[fileName] = requestQueue[fileName] || [];
    requestQueue[fileName].push({'callback':callback, 'fragmentId':fragId});
  };

  var processRequestQueue = function (url) {
    for (var i = 0, len = requestQueue[url].length; i < len; i++) {
      // Make these calls async so we avoid blocking the page/renderer
      /* jshint loopfunc: true */
      (function (index) {
        setTimeout(function () {
          requestQueue[url][index].callback(cloneSvg(svgCache[url], requestQueue[url][index].fragmentId));
        }, 0);
      })(i);
      /* jshint loopfunc: false */
    }
  };

  var loadSvg = function (url, callback) {
    var urlArr, fileName, fragId;
    urlArr = url.split('#');
    fileName = urlArr[0];
    fragId = (urlArr.length === 2) ? urlArr[1] : undefined;

    if (svgCache[fileName] !== undefined) {
      if (svgCache[fileName] instanceof SVGSVGElement) {
        // We already have it in cache, so use it
        callback(cloneSvg(svgCache[fileName], fragId));
      }
      else {
        // We don't have it in cache yet, but we are loading it, so queue this request
        queueRequest(callback, fileName, fragId);
      }
    }
    else {

      if (!window.XMLHttpRequest) {
        callback('Browser does not support XMLHttpRequest');
        return false;
      }

      // Seed the cache to indicate we are loading this URL already
      svgCache[fileName] = {};
      queueRequest(callback, fileName, fragId);

      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function () {
        // readyState 4 = complete
        if (httpRequest.readyState === 4) {

          // Handle status
          if (httpRequest.status === 404 || httpRequest.responseXML === null) {
            callback('Unable to load SVG file: ' + fileName);

            if (isLocal) callback('Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.');

            callback();
            return false;
          }

          // 200 success from server, or 0 when using file:// protocol locally
          if (httpRequest.status === 200 || (isLocal && httpRequest.status === 0)) {

            /* globals Document */
            if (httpRequest.responseXML instanceof Document) {
              // Cache it
              svgCache[fileName] = httpRequest.responseXML.documentElement;
            }
            /* globals -Document */

            // IE9 doesn't create a responseXML Document object from loaded SVG,
            // and throws a "DOM Exception: HIERARCHY_REQUEST_ERR (3)" error when injected.
            //
            // So, we'll just create our own manually via the DOMParser using
            // the the raw XML responseText.
            //
            // :NOTE: IE8 and older doesn't have DOMParser, but they can't do SVG either, so...
            else if (DOMParser && (DOMParser instanceof Function)) {
              var xmlDoc;
              try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(httpRequest.responseText, 'text/xml');
              }
              catch (e) {
                xmlDoc = undefined;
              }

              if (!xmlDoc || xmlDoc.getElementsByTagName('parsererror').length) {
                callback('Unable to parse SVG file: ' + url);
                return false;
              }
              else {
                // Cache it
                svgCache[fileName] = xmlDoc.documentElement;
              }
            }

            // We've loaded a new asset, so process any requests waiting for it
            processRequestQueue(fileName);
          }
          else {
            callback('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
            return false;
          }
        }
      };

      httpRequest.open('GET', fileName);

      // Treat and parse the response as XML, even if the
      // server sends us a different mimetype
      if (httpRequest.overrideMimeType) httpRequest.overrideMimeType('text/xml');

      httpRequest.send();
    }
  };

  // Inject a single element
  var injectElement = function (el, evalScripts, pngFallback, callback) {
    var imgUrl;

    if(spritesheetURL === false){
      // Grab the src or data-src attribute
      imgUrl = el.getAttribute('data-src') || el.getAttribute('src');
    }
    else{
      imgUrl = spritesheetURL + '#' + getSpriteIdFromClass(el);
      console.log('imgURL: ' + imgUrl);
      el.setAttribute('data-src', imgUrl);
    }

    var imgUrlSplitByFId = imgUrl.split('#');
    var fallbackUrl;

    // We can only inject SVG
    if (!(/\.svg/i).test(imgUrl)) {
      callback('Attempted to inject a file with a non-svg extension: ' + imgUrl);
      return;
    }


    if (hasSvgSupport) {
      if(isArray(fallbackClassName)) {
        removeFallbackClassNames(el, imgUrlSplitByFId[1], fallbackClassName);
      }
    }
    else{
      // If we don't have SVG support try to fall back to a png,
      // either defined per-element via data-fallback or data-png,
      // or globally via the pngFallback directory setting

      var perElementFallback = el.getAttribute('data-fallback') || el.getAttribute('data-png');

      // Per-element specific PNG fallback defined, so use that
      if (perElementFallback) {
        el.setAttribute('src', perElementFallback);
        callback(null);
      }
      // Global PNG fallback directoriy defined, use the same-named PNG
      else if (pngFallback) {

        if (imgUrlSplitByFId.length>1) {
          fallbackUrl = imgUrlSplitByFId[1] + '.png';
        }
        else{
          fallbackUrl = imgUrl.split('/').pop().replace('.svg', '.png');
        }

        if(isArray(fallbackClassName)) {
          setFallbackClassNames(el, imgUrlSplitByFId[1], fallbackClassName);
        }
        else if(isFunction(fallbackClassName)) {
          console.log('custom function to create fallbackClassName');
          fallbackClassName(el, imgUrlSplitByFId[1]);
        }
        else if(typeof fallbackClassName === 'string') {
          svgElemSetClassName(el, fallbackClassName);
        }
        else{
          el.setAttribute('src', pngFallback + '/' + fallbackUrl);
        }
        callback(null);
      }
      // um...
      else {
        callback('This browser does not support SVG and no PNG fallback was defined.');
      }

      return;
    }

    // Make sure we aren't already in the process of injecting this element to
    // avoid a race condition if multiple injections for the same element are run.
    // :NOTE: Using indexOf() only _after_ we check for SVG support and bail,
    // so no need for IE8 indexOf() polyfill
    if (injectedElements.indexOf(el) !== -1) {
      return;
    }

    // Remember the request to inject this element, in case other injection
    // calls are also trying to replace this element before we finish
    injectedElements.push(el);

    // Try to avoid loading the orginal image src if possible.
    el.setAttribute('src', '');

    // Load it up
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
      }

      // Concat the SVG classes + 'injected-svg' + the img classes
      var classMerge = [].concat(svg.getAttribute('class') || [], 'injected-svg', el.getAttribute('class') || []).join(' ');
      svg.setAttribute('class', uniqueClasses(classMerge));

      var imgStyle = el.getAttribute('style');
      if (imgStyle) {
        svg.setAttribute('style', imgStyle);
      }

      // Copy all the data elements to the svg
      var imgData = [].filter.call(el.attributes, function (at) {
        return (/^data-\w[\w\-]*$/).test(at.name);
      });
      forEach.call(imgData, function (dataAttr) {
        if (dataAttr.name && dataAttr.value) {
          svg.setAttribute(dataAttr.name, dataAttr.value);
        }
      });

      // Copy preserveAspectRatio of elem if exists
      var presARAttr = el.getAttribute('preserveAspectRatio');
      if(presARAttr){
        svg.setAttribute('preserveAspectRatio', presARAttr);
      }

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
      var clipPaths = svg.querySelectorAll('defs clipPath[id]');
      var newClipPathName;
      for (var g = 0, clipPathsLen = clipPaths.length; g < clipPathsLen; g++) {
        newClipPathName = clipPaths[g].id + '-' + injectCount;
        // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
        var usingClipPath = svg.querySelectorAll('[clip-path*="' + clipPaths[g].id + '"]');
        for (var h = 0, usingClipPathLen = usingClipPath.length; h < usingClipPathLen; h++) {
          usingClipPath[h].setAttribute('clip-path', 'url(#' + newClipPathName + ')');
        }
        clipPaths[g].id = newClipPathName;
      }

      // Do the same for masks
      var masks = svg.querySelectorAll('defs mask[id]');
      var newMaskName;
      for (var i = 0, masksLen = masks.length; i < masksLen; i++) {
        newMaskName = masks[i].id + '-' + injectCount;
        // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
        var usingMask = svg.querySelectorAll('[mask*="' + masks[i].id + '"]');
        for (var j = 0, usingMaskLen = usingMask.length; j < usingMaskLen; j++) {
          usingMask[j].setAttribute('mask', 'url(#' + newMaskName + ')');
        }
        masks[i].id = newMaskName;
      }

      // Remove any unwanted/invalid namespaces that might have been added by SVG editing tools
      svg.removeAttribute('xmlns:a');

      // Post page load injected SVGs don't automatically have their script
      // elements run, so we'll need to make that happen, if requested

      // Find then prune the scripts
      var scripts = svg.querySelectorAll('script');
      var scriptsToEval = [];
      var script, scriptType;

      for (var k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
        scriptType = scripts[k].getAttribute('type');

        // Only process javascript types.
        // SVG defaults to 'application/ecmascript' for unset types
        if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript') {

          // innerText for IE, textContent for other browsers
          script = scripts[k].innerText || scripts[k].textContent;

          // Stash
          scriptsToEval.push(script);

          // Tidy up and remove the script element since we don't need it anymore
          svg.removeChild(scripts[k]);
        }
      }

      // Run/Eval the scripts if needed
      if (scriptsToEval.length > 0 && (evalScripts === 'always' || (evalScripts === 'once' && !ranScripts[imgUrl]))) {
        for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {

          // :NOTE: Yup, this is a form of eval, but it is being used to eval code
          // the caller has explictely asked to be loaded, and the code is in a caller
          // defined SVG file... not raw user input.
          //
          // Also, the code is evaluated in a closure and not in the global scope.
          // If you need to put something in global scope, use 'window'
          new Function(scriptsToEval[l])(window); // jshint ignore:line
        }

        // Remember we already ran scripts for this svg
        ranScripts[imgUrl] = true;
      }

      // :NOTE: handle styles in style-tags
      var styleTags = svg.querySelectorAll('style'),
          prefixClassName = '';

      forEach.call(styleTags, function (styleTag) {
        var svgClassList = getClassList(svg);
        if ((svgClassList.indexOf(removeStylesClass)>=0 || removeAllStyles) && (svgClassList.indexOf(keepStylesClass)<0) ) {

          // remove the styletag if the removeStylesClass is applied to the SVG
          console.log('remove styleTag', styleTag);
          styleTag.parentNode.removeChild(styleTag);
        }
        else {
          if(prefixStyleTags){
            doPrefixStyleTags(styleTag, injectCount, svg);
          }
          else{
            // :WORKAROUND:
            // IE doesn't evaluate <style> tags in SVGs that are dynamically added to the page.
            // This trick will trigger IE to read and use any existing SVG <style> tags.
            //
            // Reference: https://github.com/iconic/SVGInjector/issues/23
            styleTag.textContent += '';
          }

        }

      });

      // Replace the image with the svg
      el.parentNode.replaceChild(svg, el);

      // Now that we no longer need it, drop references
      // to the original element so it can be GC'd
      delete injectedElements[injectedElements.indexOf(el)];
      el = null;

      // Increment the injected count
      injectCount++;

      callback(svg);
    });
  };

  /**
   * SVGInjector
   *
   * Replace the given elements with their full inline SVG DOM elements.
   *
   * :NOTE: We are using get/setAttribute with SVG because the SVG DOM spec differs from HTML DOM and
   * can return other unexpected object types when trying to directly access svg properties.
   * ex: "className" returns a SVGAnimatedString with the class value found in the "baseVal" property,
   * instead of simple string like with HTML Elements.
   *
   * @param {mixes} Array of or single DOM element
   * @param {object} options
   * @param {function} callback
   * @return {object} Instance of SVGInjector
   */
  var SVGInjector = function (elements, options, done) {

    // Options & defaults
    options = options || {};

    // Should we run the scripts blocks found in the SVG
    // 'always' - Run them every time
    // 'once' - Only run scripts once for each SVG
    // [false|'never'] - Ignore scripts
    var evalScripts = options.evalScripts || 'always';

    // Location of fallback pngs, if desired
    var pngFallback = options.pngFallback || false;

    // Only inject the part of the svg, that is specified
    // as visible through the id of an SVGViewElement
    // is default mode
    onlyInjectVisiblePart = options.onlyInjectVisiblePart || true;

    keepStylesClass  = (typeof options.keepStylesClass === 'undefined') ?
      '' : options.keepStylesClass;

    spriteClassName  = (typeof options.spriteClassName === 'undefined') ?
      defaultSpriteClassName : options.spriteClassName;

    spriteClassIdName  = (typeof options.spriteClassIdName === 'undefined') ?
      defaultSpriteClassIdName : options.spriteClassIdName;

    removeStylesClass = (typeof options.removeStylesClass === 'undefined') ?
      defaultRemoveStylesClassName : options.removeStylesClass;

    removeAllStyles = (typeof options.removeAllStyles === 'undefined') ?
      false : options.removeAllStyles;

    fallbackClassName = (typeof options.fallbackClassName === 'undefined') ?
      defaultFallbackClassNames : options.fallbackClassName;

    prefixStyleTags  = (typeof options.prefixStyleTags === 'undefined') ?
      true : options.prefixStyleTags;

    spritesheetURL = (typeof options.spritesheetURL === 'undefined' || options.spritesheetURL === '') ?
      false : options.spritesheetURL;

    prefixFragIdClass = spriteClassIdName;


    if(options.forceFallbacks){
      hasSvgSupport = false;
    }

    // Callback to run during each SVG injection, returning the SVG injected
    var eachCallback = options.each;
    var htmlElement = document.querySelector('html');

    if(hasSvgSupport) {
      htmlElement.className.replace('no-svg', '');
      if( typeof options.removeStylesClass === 'undefined' ){ // user does not want to use his own custom class -> write this style tag
        var css = 'svg.' + removeStylesClass + ' {fill: currentColor;}',
          head = document.head || document.getElementsByTagName('head')[0],
          style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        }
        else {
          style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
        console.log( 'default class written: ', css );
      }

    }
    else{
      htmlElement.className += ' no-svg';
    }

    // Do the injection...
    if (elements.length !== undefined) {
      var elementsLoaded = 0;
      forEach.call(elements, function (element) {
        injectElement(element, evalScripts, pngFallback, function (svg) {
          if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
          if (done && elements.length === ++elementsLoaded) done(elementsLoaded);
        });
      });
    }
    else {
      if (elements) {
        injectElement(elements, evalScripts, pngFallback, function (svg) {
          if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
          if (done) done(1);
          elements = null;
        });
      }
      else {
        if (done) done(0);
      }
    }
  };

  /* global module, exports: true, define */
  // Node.js or CommonJS
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = exports = SVGInjector;
  }
  // AMD support
  else if (typeof define === 'function' && define.amd) {
    define(function () {
      return SVGInjector;
    });
  }
  // Otherwise, attach to window as global
  else if (typeof window === 'object') {
    window.SVGInjector = SVGInjector;
  }
  /* global -module, -exports, -define */

}(window, document));
