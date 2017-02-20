/**
 * SVGInjector v2.0.26 - Fast, caching, dynamic inline SVG DOM injection library
 * https://github.com/flobacher/SVGInjector2
 * forked from:
 * https://github.com/iconic/SVGInjector
 *
 * Copyright (c) 2015 flobacher <flo@digital-fuse.net>
 * @license MIT
 *
 * original Copyright (c) 2014 Waybury <hello@waybury.com>
 * @license MIT
 */

(function(window, document) {
  'use strict';
  /**
   * SVGInjector
   *
   * Replace the given elements with their full inline SVG DOM elements.
   *
   * :NOTE: We are using get/setAttribute with SVG because the SVG DOM spec differs from HTML DOM and
   * can return other unexpected object types when trying to directly access svg properties.
   * ex: "className" returns a SVGAnimatedString with the class value found in the "baseVal" property,
   * instead of simple string like with HTML Elements.
   */
  var SVGInjector = (function () {


    /**
     * Constructor Function
     * @param {object} options
     */
    function SVGInjector (options) {
      SVGInjector.instanceCounter++;
      this.init(options);
    }

    // - private constants -----------------------------------------
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var XLINK_NS = 'http://www.w3.org/1999/xlink';
    var DEFAULT_SPRITE_CLASS_NAME = 'sprite';
    var DEFAULT_SPRITE_CLASS_ID_NAME = DEFAULT_SPRITE_CLASS_NAME + '--';
    var DEFAULT_FALLBACK_CLASS_NAMES = [DEFAULT_SPRITE_CLASS_NAME];
    var DEFAULT_REMOVESTYLES_CLASS_NAME = 'icon';

    // - private member vars ---------------------------------------
    var svgCache;
    var injections;
    var requestQueue;
    var ranScripts;
    var config;
    var env;

    // - private member funcs --------------------------------------
    var
      setFallbackClassNames,
      removeFallbackClassNames,
      suffixIdReferences,
      suffixIdReferencesInStyles,
      copyAttributes,
      cloneSymbolAsSVG,
      doPrefixStyleTags,
      getClassList,
      getSpriteIdFromClass,
      cloneSvg,
      queueRequest,
      processRequestQueue,
      loadSvg,
      writeDefaultClass,
      replaceNoSVGClass,
      onLoadSVG,
      uniqueClasses,
      isFunction,
      isArray,
      svgElemSetClassName,
      forEach,
      setRootLevelElem,
      addRootLevelElem
    ;



    requestQueue = [];

    // - static vars -----------------------------------------------
    SVGInjector.instanceCounter = 0;

    // - public member vars ----------------------------------------
    //SVGInjector.prototype.varName = {};



    // - public member functions ---------------------------------------
    /**
     * @param {object} options
     */
    SVGInjector.prototype.init = function(options) {
      options = options || {};
      svgCache = {};
      env = {};
      env.isLocal = window.location.protocol === 'file:';
      env.hasSvgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');

      injections = {
        count: 0,
        elements: []
      };

      ranScripts = {};
      config = {};

      // Should we run the scripts blocks found in the SVG
      // 'always' - Run them every time
      // 'once' - Only run scripts once for each SVG
      // [false|'never'] - Ignore scripts
      config.evalScripts = options.evalScripts || 'always';

      // Location of fallback pngs, if desired
      config.pngFallback = options.pngFallback || false;

      // Only inject the part of the svg, that is specified
      // as visible through the id of an SVGViewElement
      // is default mode
      config.onlyInjectVisiblePart = options.onlyInjectVisiblePart || true;

      config.keepStylesClass  = (typeof options.keepStylesClass === 'undefined') ?
        '' : options.keepStylesClass;

      config.spriteClassName  = (typeof options.spriteClassName === 'undefined') ?
        DEFAULT_SPRITE_CLASS_NAME : options.spriteClassName;

      config.spriteClassIdName  = (typeof options.spriteClassIdName === 'undefined') ?
        DEFAULT_SPRITE_CLASS_ID_NAME : options.spriteClassIdName;

      config.removeStylesClass = (typeof options.removeStylesClass === 'undefined') ?
        DEFAULT_REMOVESTYLES_CLASS_NAME : options.removeStylesClass;

      config.removeAllStyles = (typeof options.removeAllStyles === 'undefined') ?
        false : options.removeAllStyles;

      config.fallbackClassName = (typeof options.fallbackClassName === 'undefined') ?
        DEFAULT_FALLBACK_CLASS_NAMES : options.fallbackClassName;

      config.prefixStyleTags  = (typeof options.prefixStyleTags === 'undefined') ?
        true : options.prefixStyleTags;

      config.spritesheetURL = (typeof options.spritesheetURL === 'undefined' || options.spritesheetURL === '') ?
        false : options.spritesheetURL;

      config.prefixFragIdClass = config.spriteClassIdName;

      config.forceFallbacks = (typeof options.forceFallbacks === 'undefined') ?
        false : options.forceFallbacks;

      if(config.forceFallbacks){
        env.hasSvgSupport = false;
      }

      replaceNoSVGClass(document.querySelector('html'), 'no-svg', env.hasSvgSupport);

      if(env.hasSvgSupport && typeof options.removeStylesClass === 'undefined' ){ // user does not want to use his own custom class -> write this style tag
        writeDefaultClass(config.removeStylesClass);
      }
    };

    /**
     * Inject 1+ elements
     * @param {elements} Array of or single DOM element
     * @param {function} onDoneCallback
     * @param {function} eachCallback
     */
    SVGInjector.prototype.inject = function(elements, onDoneCallback, eachCallback) {
      if (elements.length !== undefined) {
        var elementsLoaded = 0;
        var ctx = this;
        forEach.call(elements, function (element) {
          ctx.injectElement(element, function (svg) {
            if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
            if (onDoneCallback && elements.length === ++elementsLoaded) onDoneCallback(elementsLoaded);
          });
        });
      }
      else {
        if (elements) {
          this.injectElement(elements, function (svg) {
            if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
            if (onDoneCallback) onDoneCallback(1);
            elements = null;
          });
        }
        else {
          if (onDoneCallback) onDoneCallback(0);
        }
      }
    };


    /**
     * Inject a single element
     * @param {elements} Array of or single DOM element
     * @param {function} onDoneCallback
     * @param {function} eachCallback
     */
    SVGInjector.prototype.injectElement = function (el, onElementInjectedCallback) {
      var imgUrl, spriteId;
      // console.log('inject element', el);
      if (config.spritesheetURL === false || el.getAttribute('data-src') || el.getAttribute('src') ) {
        // Grab the src or data-src attribute
        imgUrl = el.getAttribute('data-src') || el.getAttribute('src');
      }
      else {
        spriteId = getSpriteIdFromClass(el);
        if (spriteId === '') {
          console.warn('neither data-src nor spriteId class found! Nothing to inject here!');
          return;
        }
        imgUrl = config.spritesheetURL + '#' + spriteId;
        // console.log('imgURL: ' + imgUrl);
        el.setAttribute('data-src', imgUrl);
      }

      var imgUrlSplitByFId = imgUrl.split('#');
      if (imgUrlSplitByFId.length === 1) {
        imgUrlSplitByFId.push('');
      }
      var fallbackUrl;

      // We can only inject SVG
      if (!(/\.svg/i).test(imgUrl)) {
        onElementInjectedCallback('Attempted to inject a file with a non-svg extension: ' + imgUrl);
        return;
      }


      if (env.hasSvgSupport) {
        if (isArray(config.fallbackClassName)) {
          removeFallbackClassNames(el, imgUrlSplitByFId[1], config.fallbackClassName);
        }
      }
      else {
        // If we don't have SVG support try to fall back to a png,
        // either defined per-element via data-fallback or data-png,
        // or globally via the pngFallback directory setting

        var perElementFallback = el.getAttribute('data-fallback') || el.getAttribute('data-png');

        // Per-element specific PNG fallback defined, so use that
        if (perElementFallback) {
          el.setAttribute('src', perElementFallback);
          onElementInjectedCallback(null);
        }
        // Global PNG fallback directory defined, use the same-named PNG
        else if (config.pngFallback) {

          if (imgUrlSplitByFId.length > 1 && imgUrlSplitByFId[1]) {
            fallbackUrl = imgUrlSplitByFId[1] + '.png';
            if (isArray(config.fallbackClassName)) {
              setFallbackClassNames(el, imgUrlSplitByFId[1], config.fallbackClassName);
            }
            else if (isFunction(config.fallbackClassName)) {
              // console.info('custom function to create fallbackClassName');
              config.fallbackClassName(el, imgUrlSplitByFId[1]);
            }
            else if (typeof config.fallbackClassName === 'string') {
              svgElemSetClassName(el, config.fallbackClassName);
            }
            else {
              el.setAttribute('src', config.pngFallback + '/' + fallbackUrl);
            }
          }
          else {
            fallbackUrl = imgUrl.split('/').pop().replace('.svg', '.png');
            el.setAttribute('src', config.pngFallback + '/' + fallbackUrl);
          }

          onElementInjectedCallback(null);
        }
        // um...
        else {
          onElementInjectedCallback('This browser does not support SVG and no PNG fallback was defined.');
        }

        return;
      }

      // Make sure we aren't already in the process of injecting this element to
      // avoid a race condition if multiple injections for the same element are run.
      // :NOTE: Using indexOf() only _after_ we check for SVG support and bail,
      // so no need for IE8 indexOf() polyfill
      if (injections.elements.indexOf(el) !== -1) {
        console.warn('race', el);
        return;
      }

      // Remember the request to inject this element, in case other injection
      // calls are also trying to replace this element before we finish
      injections.elements.push(el);

      // Try to avoid loading the orginal image src if possible.
      el.setAttribute('src', '');

      // Load it up
      loadSvg(onElementInjectedCallback, imgUrl, el);

    };

    SVGInjector.prototype.getEnv = function() {
      return env;
    };

    // - private member functions -----------------------------------------------
    setFallbackClassNames = function (element, symbolId, classNames) {
      var className =  (typeof classNames === 'undefined') ? DEFAULT_FALLBACK_CLASS_NAMES : classNames.slice(0);

      // replace %s by symbolId
      forEach.call(
        className,
        function(curClassName, idx) {
          className[idx] = curClassName.replace('%s', symbolId);
        }
      );

      svgElemSetClassName(element, className);
    };

    removeFallbackClassNames = function (element, symbolId, fallbackClassNames) {
      fallbackClassNames =  (typeof fallbackClassNames === 'undefined') ? DEFAULT_FALLBACK_CLASS_NAMES.slice(0) : fallbackClassNames.slice(0);

      var idxOfCurClass,
          curClassNames,
          classAttribute = element.getAttribute('class');

      if (typeof classAttribute === 'undefined' || classAttribute === null) {
        return;
      }

      curClassNames = classAttribute.split(' ');
      if (curClassNames) {
        // replace %s by symbolId
        forEach.call(
          fallbackClassNames,
          function(curFallbackClassName) {
            curFallbackClassName = curFallbackClassName.replace('%s', symbolId);
            idxOfCurClass = curClassNames.indexOf(curFallbackClassName);
            if( idxOfCurClass >= 0 ){
              // console.log('remove class ' + curClassName);
              curClassNames[idxOfCurClass] = '';
            }

          }
        );

        element.setAttribute('class', uniqueClasses(curClassNames.join(' ')));
      }

    };

    suffixIdReferencesInStyles = function (styleTag, suffix, svg, name) {
      //var referencedIds = styleTag.textContent.match(/url\(('|")*#.+('|")*\)/g) || [];
      /*referencedIds.forEach(function (elem, idx, arr) {
        //elem =  elem.replace(/url\(('|")*#/g, '');
        arr[idx] = elem.replace(/\)/g, '-' + suffix + ')');
        console.log('style', arr[idx]);
      });
      */
      var numRefs = 0;
      styleTag.textContent = styleTag.textContent.replace(/url\(('|")*#.+('|")*(?=\))/g, function (match) {
        //console.log('match', match + '-' + suffix);
        numRefs++;
        return match + '-' + suffix;
      });
      return numRefs;
    };

    suffixIdReferences = function (svg, suffix) {
      var defs = [
        {def:'linearGradient',  attrs: ['fill', 'stroke']},
        {def:'radialGradient',  attrs: ['fill', 'stroke']},
        {def:'clipPath',        attrs: ['clip-path']},
        {def:'mask',            attrs: ['mask']},
        {def:'filter',          attrs: ['filter']},
        {def:'color-profile',   attrs: ['color-profile']},
        {def:'cursor',          attrs: ['cursor']},
        {def:'marker',          attrs: ['marker', 'marker-start', 'marker-mid', 'marker-end']}
      ];

      var newName,
          definitions,
          defLen,
          defIdx,
          refrences,
          refLen,
          refIdx,
          attrs,
          attrLen,
          attrIdx,
          allLinks,
          allLinksLen,
          allLinksIdx,
          links,
          linkLen,
          linkIdx
        ;

      forEach.call(defs, function(elem) {

        definitions = svg.querySelectorAll(elem.def + '[id]');
        for (defIdx = 0, defLen = definitions.length; defIdx < defLen; defIdx++) {
          newName = definitions[defIdx].id + '-' + suffix;

          attrs = elem.attrs;
          for (attrIdx = 0, attrLen = attrs.length; attrIdx < attrLen; attrIdx++) {

            // console.log('suffixxed ' + attribute + ': ' + newName);
            // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
            refrences = svg.querySelectorAll('[' + attrs[attrIdx] + '="url(#' + definitions[defIdx].id + ')"]');
            for (refIdx = 0, refLen = refrences.length; refIdx < refLen; refIdx++) {
              // console.log('set url', newName);
              refrences[refIdx].setAttribute(attrs[attrIdx], 'url(#' + newName + ')');
            }
          }

          // handle xlink:refrences
          // :NOTE: IE does not like the easy way:  links = svg.querySelectorAll('[*|href="#' + definitions[defIdx].id + '"]');
          allLinks = svg.querySelectorAll('[*|href]');
          links = [];
          for (allLinksIdx = 0, allLinksLen = allLinks.length; allLinksIdx < allLinksLen; allLinksIdx++) {
            if (allLinks[allLinksIdx].getAttributeNS(XLINK_NS, 'href').toString() === '#' + definitions[defIdx].id ) {
              links.push(allLinks[allLinksIdx]);
            }
          }

          for (linkIdx = 0, linkLen = links.length; linkIdx < linkLen; linkIdx++) {
            links[linkIdx].setAttributeNS(XLINK_NS, 'href', '#' + newName);
            // console.log('set link', newName, links[linkIdx]);
          }
          definitions[defIdx].id = newName;
        }
      });
    };

    copyAttributes = function (svgElemSource, svgElemTarget, attributesToIgnore) {
      var curAttr;
      if (typeof attributesToIgnore === 'undefined') { attributesToIgnore = ['id', 'viewBox']; }

      for(var i=0; i<svgElemSource.attributes.length; i++) {
        curAttr = svgElemSource.attributes.item(i);
        if (attributesToIgnore.indexOf(curAttr.name) < 0) {
          svgElemTarget.setAttribute(curAttr.name, curAttr.value);
        }
      }
    };

    cloneSymbolAsSVG = function (svgSymbol) {
      var svg = document.createElementNS(SVG_NS, 'svg');
      forEach.call(svgSymbol.childNodes, function(child){

        svg.appendChild(child.cloneNode(true));

      });
      copyAttributes(svgSymbol, svg);
      return svg;
    };



    doPrefixStyleTags = function (styleTag, injectCount, svg){
      var srcArr = svg.getAttribute('data-src').split('#');
      var regex,
          origPrefixClassName,
          newPrefixClassName,
          srcFileNameArr,
          regexSearchResult,
          styleTagContent = styleTag.textContent,
          newContent = '',
          selectorArr,
          prefixSelector = function(elem, idx, arr){
            arr[idx] = '.' + newPrefixClassName + ' ' + elem;
          },
          stylerule = '';

      if(srcArr.length > 1) {
        origPrefixClassName = srcArr[1];
        newPrefixClassName = origPrefixClassName + '-' + injectCount;
        regex = new RegExp('\\.' + origPrefixClassName + ' ', 'g');
        styleTag.textContent = styleTagContent.replace(regex, '.' + newPrefixClassName + ' ');
      }
      else { //inject a single element.. this has most probaly not gone through preprocessing
        srcFileNameArr = srcArr[0].split('/');
        newPrefixClassName = srcFileNameArr[srcFileNameArr.length-1].replace('.svg', '') + '-' + injectCount;
        // console.info('inject complete file: ' + srcArr[0]);
        //https://medium.com/jotform-form-builder/writing-a-css-parser-in-javascript-3ecaa1719a43
        regex = new RegExp('([\\s\\S]*?){([\\s\\S]*?)}', 'g');

        while ((regexSearchResult = regex.exec(styleTagContent)) !== null) {
          selectorArr = regexSearchResult[1].trim().split(', ');
          selectorArr.forEach(prefixSelector);

          var tmp =  selectorArr.join(', ') + '{' + regexSearchResult[2] + '}\n';
          newContent += tmp;
        }
        styleTag.textContent = newContent;
      }

      svg.setAttribute('class', (svg.getAttribute('class') + ' ' + newPrefixClassName));
    };

    getClassList = function (svgToCheck) {
      var curClassAttr = svgToCheck.getAttribute('class');
      return (curClassAttr) ? curClassAttr.trim().split(' ') : [];
    };

    getSpriteIdFromClass = function (element) {
      var classes = getClassList(element);
      var id = '';
      forEach.call(classes, function (curClass) {
        if(curClass.indexOf(config.spriteClassIdName) >= 0) {
          id = curClass.replace(config.spriteClassIdName, '');
          // console.log('class with prefix ' + config.spriteClassIdName + ' found. id: ' + id);
        }
      });
      return id;
    };

    cloneSvg = function (config, sourceSvg, fragId) {

      var svgElem,
        newSVG,
        viewBox,
        viewBoxAttr,
        symbolAttributesToFind,
        curClassList,
        setViewboxOnNewSVG = false,
        symbolElem = null,
        symobolList;

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
          if (config.onlyInjectVisiblePart) {
            var selector = '*[width="' + viewBox[2] + '"][height="'+viewBox[3]+'"]';

            symbolAttributesToFind = {};
            if (Math.abs(parseInt(viewBox[0])) === 0) {
              selector += ':not([x])';
            }
            else {
              symbolAttributesToFind.x = viewBox[0];
              selector += '[x="' + viewBox[0] + '"]';
            }

            if (Math.abs(parseInt(viewBox[1])) === 0) {
              selector += ':not([y])';
            }
            else {
              symbolAttributesToFind.y = viewBox[1];
              selector += '[y="' + viewBox[1] + '"]';
            }
            symobolList = sourceSvg.querySelectorAll(selector);
            if (symobolList.length > 1) {
              console.warn('more than one item, with the matching viewbox found!', symobolList);
            }
            symbolElem = symobolList[0];
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
            // console.log('referenced view shows a SVGUseElement');
            var referencedSymbol = sourceSvg.getElementById(
              symbolElem.getAttributeNS(XLINK_NS, 'href').substr(1)
            );
            newSVG = cloneSymbolAsSVG(referencedSymbol);
            viewBoxAttr = referencedSymbol.getAttribute('viewBox');
            viewBox = viewBoxAttr.split(' ');
            setViewboxOnNewSVG = true;
          }
          else {
            console.info(
              ((config.onlyInjectVisiblePart) ? 'symbol referenced via view' + fragId + ' not found' : 'option.onlyInjectVisiblePart: false') + ' -> clone complete svg!'
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
        newSVG.setAttribute('xmlns', SVG_NS);
        newSVG.setAttribute('xmlns:xlink', XLINK_NS);
        //curClassAttr = newSVG.getAttribute('class');
        curClassList = getClassList(newSVG);
        var fragIdClassName = config.prefixFragIdClass + fragId;
        if (curClassList.indexOf(fragIdClassName)<0) {
          curClassList.push(fragIdClassName);
          newSVG.setAttribute('class', curClassList.join(' '));
        }
        return newSVG;
      }

    };

    //queueRequest(requestQueue, fileName, fragId, onElementInjectedCallback, el);
    queueRequest = function (fileName, fragId, callback, el) {
      requestQueue[fileName] = requestQueue[fileName] || [];
      requestQueue[fileName].push({callback:callback, fragmentId:fragId, element:el, name: name});
    };

    processRequestQueue = function (url) {
      var requestQueueElem;
      for (var i = 0, len = requestQueue[url].length; i < len; i++) {
        // Make these calls async so we avoid blocking the page/renderer
        /* jshint loopfunc: true */
        (function (index) {
          setTimeout(function () {
            requestQueueElem = requestQueue[url][index];
            onLoadSVG(url, requestQueueElem.fragmentId, requestQueueElem.callback, requestQueueElem.element, requestQueueElem.name);
          }, 0);
        })(i);
        /* jshint loopfunc: false */
      }
    };

    loadSvg = function (onElementInjectedCallback, url, el) {
      var urlArr, fileUrl, fragId, name, pathArr;
      //var state = {onElementInjectedCallback:onElementInjectedCallback, injections:injections, config:config, url:url, el:el, ranScripts:ranScripts};
      // console.log('loadSvg', url);
      urlArr = url.split('#');
      fileUrl = urlArr[0];
      fragId = (urlArr.length === 2) ? urlArr[1] : undefined;
      //name = fragId ? undefined : ;
      if (typeof fragId !== 'undefined') {
        pathArr = fileUrl.split('/');
        name = pathArr[pathArr.length-1].replace('.svg', '');
      }

      if (svgCache[fileUrl] !== undefined) {
        if (svgCache[fileUrl] instanceof SVGSVGElement) {
          // We already have it in cache, so use it
          // console.log('We already have it in cache, so use it', fileName, fragId);
          onLoadSVG(fileUrl, fragId, onElementInjectedCallback, el, name);
        }
        else {
          // console.log('We don\'t have it in cache yet, but we are loading it, so queue this request', fileName, fragId);
          // We don't have it in cache yet, but we are loading it, so queue this request
          queueRequest(fileUrl, fragId, onElementInjectedCallback, el, name);
        }
      }
      else {

        if (!window.XMLHttpRequest) {
          onElementInjectedCallback('Browser does not support XMLHttpRequest');
          return false;
        }

        // Seed the cache to indicate we are loading this URL already
        svgCache[fileUrl] = {};
        queueRequest(fileUrl, fragId, onElementInjectedCallback, el, name);

        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function () {
          // readyState 4 = complete
          if (httpRequest.readyState === 4) {

            // Handle status
            if (httpRequest.status === 404 || httpRequest.responseXML === null) {
              onElementInjectedCallback('Unable to load SVG file: ' + fileUrl);

              // @check this!
              //if (env.isLocal) {
              //  onLoadCompleteCb('Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.');
              //}
              //
              //onLoadCompleteCb();
              return false;
            }

            // 200 success from server, or 0 when using file:// protocol locally
            if (httpRequest.status === 200 || (env.isLocal && httpRequest.status === 0)) {

              if (httpRequest.responseXML instanceof Document) {
                // Cache it
                svgCache[fileUrl] = httpRequest.responseXML.documentElement;
              }

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
                  onElementInjectedCallback('Unable to parse SVG file: ' + url);
                  return false;
                }
                else {
                  // Cache it
                  svgCache[fileUrl] = xmlDoc.documentElement;
                }
              }

              // We've loaded a new asset, so process any requests waiting for it
              processRequestQueue(fileUrl);
            }
            else {
              onElementInjectedCallback('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
              return false;
            }
          }
        };

        httpRequest.open('GET', fileUrl);

        // Treat and parse the response as XML, even if the
        // server sends us a different mimetype>
        if (httpRequest.overrideMimeType) httpRequest.overrideMimeType('text/xml');

        httpRequest.send();
      }
    };

    writeDefaultClass = function(removeStylesClass) {
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
      // console.info( 'default class written: ', css );
    };

    replaceNoSVGClass = function(element, noSVGClassName, hasSvgSupport) {
      if(hasSvgSupport) {
        element.className.replace(noSVGClassName, '');
      }
      else{
        element.className += ' ' + noSVGClassName;
      }
    };


    onLoadSVG = function(url, fragmentId, onElementInjectedCallback, el, name){
      // console.log('onLoadSVG', url, fragmentId, onElementInjectedCallback, el, name);
      var svg,
          imgId,
          titleId,
          descId,
          ariaHidden;

      svg = cloneSvg(config, svgCache[url], fragmentId);
      if (typeof svg === 'undefined' || typeof svg === 'string') {
        onElementInjectedCallback(svg);
        return false;
      }

      // take care of accessibility
      svg.setAttribute('role', 'img');
      forEach.call(svg.children || [], function (curChildElem) { // IE does not support Children on SVGElement!
        if (
          !(curChildElem instanceof SVGDefsElement) &&
          !(curChildElem instanceof SVGTitleElement) &&
          !(curChildElem instanceof SVGDescElement)
        ) {
          curChildElem.setAttribute('role', 'presentation');
        }
      });


      // set aria-hidden attribute
      ariaHidden = el.getAttribute('aria-hidden') || svg.getAttribute('aria-hidden');

      // set desc + title
      descId = setRootLevelElem('desc', svg, el, fragmentId, name, !ariaHidden);
      titleId = setRootLevelElem('title', svg, el, fragmentId, name, !ariaHidden);
      if (ariaHidden) {
        svg.setAttribute('aria-hidden', 'true');
      } else {
        svg.setAttribute('aria-labelledby', titleId + ' ' + descId);
      }

      // copy attributes of original element to new svg excluding class
      copyAttributes(el, svg, ['class']);


      // Concat the SVG classes + 'injected-svg' + the img classes
      var classMerge = [].concat(svg.getAttribute('class') || [], 'injected-svg', el.getAttribute('class') || []).join(' ');
      svg.setAttribute('class', uniqueClasses(classMerge));

      // Make sure any internally referenced ids and their
      // references are unique.
      //
      // This addresses the issue of having multiple instances of the
      // same SVG on a page and only the first clipPath, gradient, mask or filter id is referenced.
      suffixIdReferences(svg, injections.count, name);


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
      if (scriptsToEval.length > 0 && (config.evalScripts === 'always' || (config.evalScripts === 'once' && ! ranScripts[url]))) {
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
        ranScripts[url] = true;
      }

      // :NOTE: handle styles in style-tags
      var styleTags = svg.querySelectorAll('style');

      forEach.call(styleTags, function (styleTag) {
        var svgClassList = getClassList(svg),
          stylesUntouched = true;
        if ((svgClassList.indexOf(config.removeStylesClass)>=0 || config.removeAllStyles) && (svgClassList.indexOf(config.keepStylesClass)<0) ) {

          // remove the styletag if the removeStylesClass is applied to the SVG
          // console.log('remove styleTag', styleTag);
          styleTag.parentNode.removeChild(styleTag);
        }
        else {

          if (suffixIdReferencesInStyles(styleTag, injections.count, svg, name) > 0) {
            stylesUntouched = false;
          }

          if (config.prefixStyleTags){
            doPrefixStyleTags(styleTag, injections.count, svg, name);
            stylesUntouched = false;
          }

          if (stylesUntouched) {
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
      delete injections.elements[injections.elements.indexOf(el)];
      //el = null;

      // Increment the injected count
      injections.count++;

      onElementInjectedCallback(svg);
    };

    //- general helper functions ------------------------------------------------

  //var toCamelCase = function(str) {
  //  return str.replace(/^([A-Z])|[-_](\w)/g, function(match, p1, p2, offset) {
  //    if (p2) return p2.toUpperCase();
  //    return p1.toLowerCase();
  //  });
  //}

    uniqueClasses = function(list) {
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

    isFunction = function(obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };

    svgElemSetClassName = function(el, newClassNames){
      var curClasses = el.getAttribute('class');
      curClasses = curClasses ? curClasses : '';

      if(isArray(newClassNames)) {
        newClassNames = newClassNames.join(' ');
      }

      newClassNames = curClasses + ' ' + newClassNames;

      el.setAttribute('class', uniqueClasses(newClassNames));
    };

    /**
     * cache (or polyfill for <= IE8) Array.forEach()
     * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    forEach = Array.prototype.forEach || function (fn, scope) {
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

    setRootLevelElem = function (type, svg, el, fragmentId, addDefault) {
      var
        elemId = fragmentId ? fragmentId + '-' : '',
        existingElem
      ;
      elemId += type + '-' + injections.count;

      existingElem = el.querySelector(type);
      if (existingElem) { // element exists in the injection target
        addRootLevelElem(type, svg, existingElem.textContent, elemId, svg.firstChild);
      } else {
        existingElem = svg.querySelector(type);
        if (existingElem) { // element exists in the svg to inject, only update its id
          existingElem.setAttribute('id', elemId);
        } else {

          if (addDefault) {
            // neither injection target nor the svg to inject contain this element -> create with default content
            addRootLevelElem(type, svg, fragmentId, elemId, svg.firstChild);
          } else {
            elemId = '';
          }
        }
      }
      return elemId;
    };

    addRootLevelElem = function (type, svg, text, id, insertBefore) {
      var newElem,
          existingElem = svg.querySelector(type);

      if (existingElem) { // remove
        existingElem.parentNode.removeChild(existingElem);
      }

      newElem = document.createElementNS(SVG_NS, type);
      newElem.appendChild(document.createTextNode(text));
      newElem.setAttribute('id', id);

      svg.insertBefore(newElem, insertBefore);

      return newElem;
    };

    return SVGInjector;
  })();

  if (typeof angular === 'object') {
    // use with angular
    angular
      .module('svginjector', [])
      .provider('svgInjectorOptions', function() {
        var injectorOpts = {};
        return {
          set: function (opts) {
            injectorOpts = opts;
          },
          $get: function () {
            return injectorOpts;
          }
        };
      })
      .factory('svgInjectorFactory', ['svgInjectorOptions', function (svgInjectorOptions) {
        // console.log('new injector');
        return new SVGInjector(svgInjectorOptions);
      }])
      .directive('svg', ['svgInjectorFactory', function(svgInjectorFactory) {
        return {
          restrict: 'E',
          link: function (scope, element, attrs) {
            if (attrs.hasOwnProperty('class')) {
              attrs.$observe('class', function() {
                svgInjectorFactory.inject(element[0]);
              });
            } else {
              svgInjectorFactory.inject(element[0]);
            }

          }
        };
      }])
    ;
  }
  else{
    // use standalone -> UMD

    // Node.js or CommonJS
    if (typeof module === 'object' && typeof module.exports === 'object') {
      module.exports = SVGInjector;
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
  }
}(window, document));
