'use strict';

var SVGInjector = function() {
    function SVGInjector(options) {
        SVGInjector.instanceCounter++;
        this.init(options);
    }
    var svgCache, injections, requestQueue, ranScripts, config, env, SVG_NS = 'http://www.w3.org/2000/svg', XLINK_NS = 'http://www.w3.org/1999/xlink', DEFAULT_SPRITE_CLASS_NAME = 'sprite', DEFAULT_SPRITE_CLASS_ID_NAME = DEFAULT_SPRITE_CLASS_NAME + '--', DEFAULT_FALLBACK_CLASS_NAMES = [ DEFAULT_SPRITE_CLASS_NAME ], DEFAULT_REMOVESTYLES_CLASS_NAME = 'icon';
    SVGInjector.instanceCounter = 0;
    SVGInjector.prototype.init = function(options) {
        options = options || {};
        svgCache = {};
        env = {};
        env.isLocal = 'file:' === window.location.protocol;
        env.hasSvgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');
        injections = {
            count: 0,
            elements: []
        };
        requestQueue = [];
        ranScripts = {};
        config = {};
        config.evalScripts = options.evalScripts || 'always';
        config.pngFallback = options.pngFallback || !1;
        config.onlyInjectVisiblePart = options.onlyInjectVisiblePart || !0;
        config.keepStylesClass = 'undefined' == typeof options.keepStylesClass ? '' : options.keepStylesClass;
        config.spriteClassName = 'undefined' == typeof options.spriteClassName ? DEFAULT_SPRITE_CLASS_NAME : options.spriteClassName;
        config.spriteClassIdName = 'undefined' == typeof options.spriteClassIdName ? DEFAULT_SPRITE_CLASS_ID_NAME : options.spriteClassIdName;
        config.removeStylesClass = 'undefined' == typeof options.removeStylesClass ? DEFAULT_REMOVESTYLES_CLASS_NAME : options.removeStylesClass;
        config.removeAllStyles = 'undefined' == typeof options.removeAllStyles ? !1 : options.removeAllStyles;
        config.fallbackClassName = 'undefined' == typeof options.fallbackClassName ? DEFAULT_FALLBACK_CLASS_NAMES : options.fallbackClassName;
        config.prefixStyleTags = 'undefined' == typeof options.prefixStyleTags ? !0 : options.prefixStyleTags;
        config.spritesheetURL = 'undefined' == typeof options.spritesheetURL || '' === options.spritesheetURL ? !1 : options.spritesheetURL;
        config.prefixFragIdClass = config.spriteClassIdName;
        config.forceFallbacks = 'undefined' == typeof options.forceFallbacks ? !1 : options.forceFallbacks;
        config.forceFallbacks && (env.hasSvgSupport = !1);
        replaceNoSVGClass(document.querySelector('html'), 'no-svg', env.hasSvgSupport);
        env.hasSvgSupport && 'undefined' == typeof options.removeStylesClass && writeDefaultClass(config.removeStylesClass);
    };
    SVGInjector.prototype.inject = function(elements, onDoneCallback, eachCallback) {
        if (void 0 !== elements.length) {
            var elementsLoaded = 0, ctx = this;
            forEach.call(elements, function(element) {
                ctx.injectElement(element, function(svg) {
                    eachCallback && 'function' == typeof eachCallback && eachCallback(svg);
                    onDoneCallback && elements.length === ++elementsLoaded && onDoneCallback(elementsLoaded);
                });
            });
        } else elements ? this.injectElement(elements, function(svg) {
            eachCallback && 'function' == typeof eachCallback && eachCallback(svg);
            onDoneCallback && onDoneCallback(1);
            elements = null;
        }) : onDoneCallback && onDoneCallback(0);
    };
    SVGInjector.prototype.injectElement = function(el, onElementInjectedCallback) {
        var imgUrl;
        console.log('inject element', el);
        if (config.spritesheetURL === !1) imgUrl = el.getAttribute('data-src') || el.getAttribute('src'); else {
            imgUrl = config.spritesheetURL + '#' + getSpriteIdFromClass(el);
            el.setAttribute('data-src', imgUrl);
        }
        var fallbackUrl, imgUrlSplitByFId = imgUrl.split('#');
        if (/\.svg/i.test(imgUrl)) if (env.hasSvgSupport) {
            isArray(config.fallbackClassName) && removeFallbackClassNames(el, imgUrlSplitByFId[1], config.fallbackClassName);
            if (-1 === injections.elements.indexOf(el)) {
                injections.elements.push(el);
                el.setAttribute('src', '');
                loadSvg(onElementInjectedCallback, imgUrl, el);
            } else console.warn('race', el);
        } else {
            var perElementFallback = el.getAttribute('data-fallback') || el.getAttribute('data-png');
            if (perElementFallback) {
                el.setAttribute('src', perElementFallback);
                onElementInjectedCallback(null);
            } else if (config.pngFallback) {
                fallbackUrl = imgUrlSplitByFId.length > 1 ? imgUrlSplitByFId[1] + '.png' : imgUrl.split('/').pop().replace('.svg', '.png');
                if (isArray(config.fallbackClassName)) setFallbackClassNames(el, imgUrlSplitByFId[1], config.fallbackClassName); else if (isFunction(config.fallbackClassName)) {
                    console.info('custom function to create fallbackClassName');
                    config.fallbackClassName(el, imgUrlSplitByFId[1]);
                } else 'string' == typeof config.fallbackClassName ? svgElemSetClassName(el, config.fallbackClassName) : el.setAttribute('src', config.pngFallback + '/' + fallbackUrl);
                onElementInjectedCallback(null);
            } else onElementInjectedCallback('This browser does not support SVG and no PNG fallback was defined.');
        } else onElementInjectedCallback('Attempted to inject a file with a non-svg extension: ' + imgUrl);
    };
    SVGInjector.prototype.getEnv = function() {
        return env;
    };
    var setFallbackClassNames = function(element, symbolId, classNames) {
        var className = 'undefined' == typeof classNames ? DEFAULT_FALLBACK_CLASS_NAMES : classNames.slice(0);
        forEach.call(className, function(curClassName, idx) {
            className[idx] = curClassName.replace('%s', symbolId);
        });
        svgElemSetClassName(element, className);
    }, removeFallbackClassNames = function(element, symbolId, fallbackClassNames) {
        fallbackClassNames = 'undefined' == typeof fallbackClassNames ? DEFAULT_FALLBACK_CLASS_NAMES.slice(0) : fallbackClassNames.slice(0);
        var idxOfCurClass, curClassNames = element.getAttribute('class').split(' ');
        if (curClassNames) {
            forEach.call(fallbackClassNames, function(curFallbackClassName) {
                curFallbackClassName = curFallbackClassName.replace('%s', symbolId);
                idxOfCurClass = curClassNames.indexOf(curFallbackClassName);
                idxOfCurClass >= 0 && (curClassNames[idxOfCurClass] = '');
            });
            element.setAttribute('class', uniqueClasses(curClassNames.join(' ')));
        }
    }, prefixIdReferences = function(svg, suffix) {
        var def, attribute, newName, defs = [ {
            def: 'linearGradient',
            attr: 'fill'
        }, {
            def: 'radialGradient',
            attr: 'fill'
        }, {
            def: 'clipPath',
            attr: 'clip-path'
        }, {
            def: 'mask',
            attr: 'mask'
        }, {
            def: 'filter',
            attr: 'filter'
        } ];
        forEach.call(defs, function(elem) {
            def = elem.def;
            attribute = elem.attr;
            for (var definitions = svg.querySelectorAll(def + '[id]'), g = 0, defLen = definitions.length; defLen > g; g++) {
                newName = definitions[g].id + '-' + suffix;
                for (var usingElements = svg.querySelectorAll('[' + attribute + '*="' + definitions[g].id + '"]'), h = 0, usingElementsLen = usingElements.length; usingElementsLen > h; h++) usingElements[h].setAttribute(attribute, 'url(#' + newName + ')');
                definitions[g].id = newName;
            }
        });
    }, copyAttributes = function(svgElemSource, svgElemTarget, attributesToIgnore) {
        var curAttr;
        'undefined' == typeof attributesToIgnore && (attributesToIgnore = [ 'id', 'viewBox' ]);
        for (var i = 0; i < svgElemSource.attributes.length; i++) {
            curAttr = svgElemSource.attributes.item(i);
            attributesToIgnore.indexOf(curAttr.name) < 0 && svgElemTarget.setAttribute(curAttr.name, curAttr.value);
        }
    }, cloneSymbolAsSVG = function(svgSymbol) {
        var svg = document.createElementNS(SVG_NS, 'svg');
        forEach.call(svgSymbol.childNodes, function(child) {
            svg.appendChild(child.cloneNode(!0));
        });
        copyAttributes(svgSymbol, svg);
        return svg;
    }, doPrefixStyleTags = function(styleTag, injectCount, svg) {
        var srcArr = svg.getAttribute('data-src').split('#');
        if (srcArr.length > 1) {
            var origPrefixClassName = srcArr[1], regex = new RegExp('\\.' + origPrefixClassName + ' ', 'g'), newPrefixClassName = origPrefixClassName + '-' + injectCount;
            styleTag.textContent = styleTag.textContent.replace(regex, '.' + newPrefixClassName + ' ');
            svg.setAttribute('class', svg.getAttribute('class') + ' ' + newPrefixClassName);
        }
    }, getClassList = function(svgToCheck) {
        var curClassAttr = svgToCheck.getAttribute('class');
        return curClassAttr ? curClassAttr.split(' ') : [];
    }, getSpriteIdFromClass = function(element) {
        var classes = getClassList(element), id = '';
        forEach.call(classes, function(curClass) {
            curClass.indexOf(config.spriteClassIdName) >= 0 && (id = curClass.replace(config.spriteClassIdName, ''));
        });
        return id;
    }, cloneSvg = function(config, sourceSvg, fragId) {
        var svgElem, newSVG, viewBox, viewBoxAttr, symbolAttributesToFind, curClassList, setViewboxOnNewSVG = !1, symbolElem = null;
        if (void 0 === fragId) return sourceSvg.cloneNode(!0);
        svgElem = sourceSvg.getElementById(fragId);
        if (svgElem) {
            viewBoxAttr = svgElem.getAttribute('viewBox');
            viewBox = viewBoxAttr.split(' ');
            if (svgElem instanceof SVGSymbolElement) {
                newSVG = cloneSymbolAsSVG(svgElem);
                setViewboxOnNewSVG = !0;
            } else if (svgElem instanceof SVGViewElement) {
                symbolElem = null;
                if (config.onlyInjectVisiblePart) {
                    var selector = '*[width="' + viewBox[2] + '"][height="' + viewBox[3] + '"]';
                    symbolAttributesToFind = {};
                    if (Math.abs(parseInt(viewBox[0])) > 0) {
                        symbolAttributesToFind.x = viewBox[0];
                        selector += '[x="' + viewBox[0] + '"]';
                    }
                    if (Math.abs(parseInt(viewBox[1])) > 0) {
                        symbolAttributesToFind.y = viewBox[1];
                        selector += '[y="' + viewBox[1] + '"]';
                    }
                    symbolElem = sourceSvg.querySelector(selector);
                }
                if (symbolElem && symbolElem instanceof SVGSVGElement) {
                    newSVG = symbolElem.cloneNode(!0);
                    for (var prop in symbolAttributesToFind) 'width' !== prop && 'height' !== prop && newSVG.removeAttribute(prop);
                } else if (symbolElem && symbolElem instanceof SVGUseElement) {
                    var referencedSymbol = sourceSvg.getElementById(symbolElem.getAttributeNS(XLINK_NS, 'href').substr(1));
                    newSVG = cloneSymbolAsSVG(referencedSymbol);
                    viewBoxAttr = referencedSymbol.getAttribute('viewBox');
                    viewBox = viewBoxAttr.split(' ');
                    setViewboxOnNewSVG = !0;
                } else {
                    console.info((config.onlyInjectVisiblePart ? 'symbol referenced via view' + fragId + ' not found' : 'option.onlyInjectVisiblePart: false') + ' -> clone complete svg!');
                    setViewboxOnNewSVG = !0;
                    newSVG = sourceSvg.cloneNode(!0);
                }
            }
            if (setViewboxOnNewSVG) {
                newSVG.setAttribute('viewBox', viewBox.join(' '));
                newSVG.setAttribute('width', viewBox[2] + 'px');
                newSVG.setAttribute('height', viewBox[3] + 'px');
            }
            curClassList = getClassList(newSVG);
            var fragIdClassName = config.prefixFragIdClass + fragId;
            if (curClassList.indexOf(fragIdClassName) < 0) {
                curClassList.push(fragIdClassName);
                newSVG.setAttribute('class', curClassList.join(' '));
            }
            return newSVG;
        }
        console.warn(fragId + ' not found in svg', sourceSvg);
    }, queueRequest = function(fileName, fragId, callback, el) {
        requestQueue[fileName] = requestQueue[fileName] || [];
        requestQueue[fileName].push({
            callback: callback,
            fragmentId: fragId,
            element: el
        });
    }, processRequestQueue = function(url) {
        for (var requestQueueElem, i = 0, len = requestQueue[url].length; len > i; i++) !function(index) {
            setTimeout(function() {
                requestQueueElem = requestQueue[url][index];
                onLoadSVG(url, requestQueueElem.fragmentId, requestQueueElem.callback, requestQueueElem.element);
            }, 0);
        }(i);
    }, loadSvg = function(onElementInjectedCallback, url, el) {
        var urlArr, fileName, fragId;
        urlArr = url.split('#');
        fileName = urlArr[0];
        fragId = 2 === urlArr.length ? urlArr[1] : void 0;
        if (void 0 !== svgCache[fileName]) svgCache[fileName] instanceof SVGSVGElement ? onLoadSVG(fileName, fragId, onElementInjectedCallback, el) : queueRequest(fileName, fragId, onElementInjectedCallback, el); else {
            if (!window.XMLHttpRequest) {
                onElementInjectedCallback('Browser does not support XMLHttpRequest');
                return !1;
            }
            svgCache[fileName] = {};
            queueRequest(fileName, fragId, onElementInjectedCallback, el);
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (4 === httpRequest.readyState) {
                    if (404 === httpRequest.status || null === httpRequest.responseXML) {
                        onElementInjectedCallback('Unable to load SVG file: ' + fileName);
                        return !1;
                    }
                    if (!(200 === httpRequest.status || env.isLocal && 0 === httpRequest.status)) {
                        onElementInjectedCallback('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
                        return !1;
                    }
                    if (httpRequest.responseXML instanceof Document) svgCache[fileName] = httpRequest.responseXML.documentElement; else if (DOMParser && DOMParser instanceof Function) {
                        var xmlDoc;
                        try {
                            var parser = new DOMParser();
                            xmlDoc = parser.parseFromString(httpRequest.responseText, 'text/xml');
                        } catch (e) {
                            xmlDoc = void 0;
                        }
                        if (!xmlDoc || xmlDoc.getElementsByTagName('parsererror').length) {
                            onElementInjectedCallback('Unable to parse SVG file: ' + url);
                            return !1;
                        }
                        svgCache[fileName] = xmlDoc.documentElement;
                    }
                    processRequestQueue(fileName);
                }
            };
            httpRequest.open('GET', fileName);
            httpRequest.overrideMimeType && httpRequest.overrideMimeType('text/xml');
            httpRequest.send();
        }
    }, writeDefaultClass = function(removeStylesClass) {
        var css = 'svg.' + removeStylesClass + ' {fill: currentColor;}', head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
        style.type = 'text/css';
        style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        console.info('default class written: ', css);
    }, replaceNoSVGClass = function(element, noSVGClassName, hasSvgSupport) {
        hasSvgSupport ? element.className.replace(noSVGClassName, '') : element.className += ' ' + noSVGClassName;
    }, onLoadSVG = function(url, fragmentId, onElementInjectedCallback, el) {
        console.log('onLoadSVG', url, fragmentId, onElementInjectedCallback, el);
        var svg = cloneSvg(config, svgCache[url], fragmentId);
        if ('undefined' == typeof svg || 'string' == typeof svg) {
            onElementInjectedCallback(svg);
            return !1;
        }
        var imgId = el.getAttribute('id');
        imgId && svg.setAttribute('id', imgId);
        var imgTitle = el.getAttribute('title');
        imgTitle && svg.setAttribute('title', imgTitle);
        var classMerge = [].concat(svg.getAttribute('class') || [], 'injected-svg', el.getAttribute('class') || []).join(' ');
        svg.setAttribute('class', uniqueClasses(classMerge));
        var imgStyle = el.getAttribute('style');
        imgStyle && svg.setAttribute('style', imgStyle);
        var imgData = [].filter.call(el.attributes, function(at) {
            return /^data-\w[\w\-]*$/.test(at.name);
        });
        forEach.call(imgData, function(dataAttr) {
            dataAttr.name && dataAttr.value && svg.setAttribute(dataAttr.name, dataAttr.value);
        });
        var presARAttr = el.getAttribute('preserveAspectRatio');
        presARAttr && svg.setAttribute('preserveAspectRatio', presARAttr);
        prefixIdReferences(svg, injections.count);
        svg.removeAttribute('xmlns:a');
        for (var script, scriptType, scripts = svg.querySelectorAll('script'), scriptsToEval = [], k = 0, scriptsLen = scripts.length; scriptsLen > k; k++) {
            scriptType = scripts[k].getAttribute('type');
            if (!scriptType || 'application/ecmascript' === scriptType || 'application/javascript' === scriptType) {
                script = scripts[k].innerText || scripts[k].textContent;
                scriptsToEval.push(script);
                svg.removeChild(scripts[k]);
            }
        }
        if (scriptsToEval.length > 0 && ('always' === config.evalScripts || 'once' === config.evalScripts && !ranScripts[url])) {
            for (var l = 0, scriptsToEvalLen = scriptsToEval.length; scriptsToEvalLen > l; l++) new Function(scriptsToEval[l])(window);
            ranScripts[url] = !0;
        }
        var styleTags = svg.querySelectorAll('style');
        forEach.call(styleTags, function(styleTag) {
            var svgClassList = getClassList(svg);
            (svgClassList.indexOf(config.removeStylesClass) >= 0 || config.removeAllStyles) && svgClassList.indexOf(config.keepStylesClass) < 0 ? styleTag.parentNode.removeChild(styleTag) : config.prefixStyleTags ? doPrefixStyleTags(styleTag, injections.count, svg) : styleTag.textContent += '';
        });
        el.parentNode.replaceChild(svg, el);
        delete injections.elements[injections.elements.indexOf(el)];
        injections.count++;
        onElementInjectedCallback(svg);
    }, uniqueClasses = function(list) {
        list = list.split(' ');
        for (var hash = {}, i = list.length, out = []; i--; ) if (!hash.hasOwnProperty(list[i])) {
            hash[list[i]] = 1;
            out.unshift(list[i]);
        }
        return out.join(' ');
    }, isFunction = function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }, isArray = function(obj) {
        return '[object Array]' === Object.prototype.toString.call(obj);
    }, svgElemSetClassName = function(el, newClassNames) {
        var curClasses = el.getAttribute('class');
        curClasses = curClasses ? curClasses : '';
        isArray(newClassNames) && (newClassNames = newClassNames.join(' '));
        newClassNames = curClasses + ' ' + newClassNames;
        el.setAttribute('class', uniqueClasses(newClassNames));
    }, forEach = Array.prototype.forEach || function(fn, scope) {
        if (void 0 === this || null === this || 'function' != typeof fn) throw new TypeError();
        var i, len = this.length >>> 0;
        for (i = 0; len > i; ++i) i in this && fn.call(scope, this[i], i, this);
    };
    return SVGInjector;
}();

angular.module('svginjector', []).value('injectorOptions', {});

angular.module('svginjector').directive('svg', [ 'svgInjectorFactory', function(svgInjectorFactory) {
    return {
        restrict: 'E',
        replace: !0,
        scope: {},
        link: function(scope, element) {
            svgInjectorFactory.inject(element[0]);
        }
    };
} ]);

angular.module('svginjector').factory('svgInjectorFactory', [ 'injectorOptions', function(injectorOptions) {
    console.log('new injector');
    return new SVGInjector(injectorOptions);
} ]);
//# sourceMappingURL=./dist/ng-svg-injector.map.js