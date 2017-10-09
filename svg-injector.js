/*!
 * SVGInjector v2.1.3 - Fast, caching, dynamic inline SVG DOM injection library
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
    "use strict";
    var SVGInjector = function() {
        function SVGInjector(options) {
            SVGInjector.instanceCounter++;
            this.init(options);
        }
        var SVG_NS = "http://www.w3.org/2000/svg";
        var XLINK_NS = "http://www.w3.org/1999/xlink";
        var DEFAULT_SPRITE_CLASS_NAME = "sprite";
        var DEFAULT_SPRITE_CLASS_ID_NAME = DEFAULT_SPRITE_CLASS_NAME + "--";
        var DEFAULT_FALLBACK_CLASS_NAMES = [ DEFAULT_SPRITE_CLASS_NAME ];
        var DEFAULT_REMOVESTYLES_CLASS_NAME = "icon";
        var svgCache;
        var injections;
        var requestQueue;
        var ranScripts;
        var config;
        var env;
        var setFallbackClassNames, removeFallbackClassNames, suffixIdReferences, suffixIdReferencesInStyles, copyAttributes, cloneSymbolAsSVG, doPrefixStyleTags, getClassList, getSpriteIdFromClass, cloneSvg, queueRequest, processRequestQueue, loadSvg, writeDefaultClass, replaceNoSVGClass, onLoadSVG, uniqueClasses, isFunction, isArray, svgElemSetClassName, forEach, setRootLevelElem, addRootLevelElem, injectElement;
        requestQueue = [];
        SVGInjector.instanceCounter = 0;
        SVGInjector.prototype.init = function(options) {
            options = options || {};
            svgCache = {};
            env = {};
            env.isLocal = window.location.protocol === "file:";
            env.hasSvgSupport = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
            injections = {
                count: 0,
                elements: []
            };
            ranScripts = {};
            config = {};
            config.evalScripts = options.evalScripts || "always";
            config.pngFallback = options.pngFallback || false;
            config.svgFallbackDir = options.svgFallbackDir || false;
            config.onlyInjectVisiblePart = options.onlyInjectVisiblePart || true;
            config.keepStylesClass = typeof options.keepStylesClass === "undefined" ? "" : options.keepStylesClass;
            config.spriteClassName = typeof options.spriteClassName === "undefined" ? DEFAULT_SPRITE_CLASS_NAME : options.spriteClassName;
            config.spriteClassIdName = typeof options.spriteClassIdName === "undefined" ? DEFAULT_SPRITE_CLASS_ID_NAME : options.spriteClassIdName;
            config.removeStylesClass = typeof options.removeStylesClass === "undefined" ? DEFAULT_REMOVESTYLES_CLASS_NAME : options.removeStylesClass;
            config.removeAllStyles = typeof options.removeAllStyles === "undefined" ? false : options.removeAllStyles;
            config.fallbackClassName = typeof options.fallbackClassName === "undefined" ? DEFAULT_FALLBACK_CLASS_NAMES : options.fallbackClassName;
            config.prefixStyleTags = typeof options.prefixStyleTags === "undefined" ? true : options.prefixStyleTags;
            config.spritesheetURL = typeof options.spritesheetURL === "undefined" || options.spritesheetURL === "" ? false : options.spritesheetURL;
            config.prefixFragIdClass = config.spriteClassIdName;
            config.forceFallbacks = typeof options.forceFallbacks === "undefined" ? false : options.forceFallbacks;
            if (config.forceFallbacks) {
                env.hasSvgSupport = false;
            }
            replaceNoSVGClass(document.querySelector("html"), "no-svg", env.hasSvgSupport);
            if (env.hasSvgSupport && typeof options.removeStylesClass === "undefined") {
                writeDefaultClass(config.removeStylesClass);
            }
        };
        SVGInjector.prototype.inject = function(elements, onDoneCallback, eachCallback) {
            if (elements.length !== undefined) {
                var elementsLoaded = 0;
                var ctx = this;
                forEach.call(elements, function(element) {
                    ctx.injectElement(element, function(svg) {
                        if (eachCallback && typeof eachCallback === "function") eachCallback(svg);
                        if (onDoneCallback && elements.length === ++elementsLoaded) onDoneCallback(elementsLoaded);
                    });
                });
            } else {
                if (elements) {
                    this.injectElement(elements, function(svg) {
                        if (eachCallback && typeof eachCallback === "function") eachCallback(svg);
                        if (onDoneCallback) onDoneCallback(1);
                        elements = null;
                    });
                } else {
                    if (onDoneCallback) onDoneCallback(0);
                }
            }
        };
        injectElement = SVGInjector.prototype.injectElement = function(el, onElementInjectedCallback) {
            var imgUrl = el.getAttribute("data-src") || el.getAttribute("src"), spriteId;
            if (!imgUrl) {
                if (config.spritesheetURL) {
                    spriteId = getSpriteIdFromClass(el);
                    if (spriteId === "") {
                        return;
                    }
                    imgUrl = config.spritesheetURL + "#" + spriteId;
                } else {
                    return;
                }
            }
            el.setAttribute("data-src", imgUrl);
            var imgUrlSplitByFId = imgUrl.split("#");
            if (imgUrlSplitByFId.length === 1) {
                imgUrlSplitByFId.push("");
            }
            var fallbackUrl;
            if (!/\.svg/i.test(imgUrl)) {
                onElementInjectedCallback("Attempted to inject a file with a non-svg extension: " + imgUrl);
                return;
            }
            if (env.hasSvgSupport) {
                if (isArray(config.fallbackClassName)) {
                    removeFallbackClassNames(el, imgUrlSplitByFId[1], config.fallbackClassName);
                }
            } else {
                var perElementFallback = el.getAttribute("data-fallback") || el.getAttribute("data-png");
                if (perElementFallback) {
                    el.setAttribute("src", perElementFallback);
                    onElementInjectedCallback(null);
                } else if (config.pngFallback) {
                    if (imgUrlSplitByFId.length > 1 && imgUrlSplitByFId[1]) {
                        fallbackUrl = imgUrlSplitByFId[1] + ".png";
                        if (isArray(config.fallbackClassName)) {
                            setFallbackClassNames(el, imgUrlSplitByFId[1], config.fallbackClassName);
                        } else if (isFunction(config.fallbackClassName)) {
                            config.fallbackClassName(el, imgUrlSplitByFId[1]);
                        } else if (typeof config.fallbackClassName === "string") {
                            svgElemSetClassName(el, config.fallbackClassName);
                        } else {
                            el.setAttribute("src", config.pngFallback + "/" + fallbackUrl);
                        }
                    } else {
                        fallbackUrl = imgUrl.split("/").pop().replace(".svg", ".png");
                        el.setAttribute("src", config.pngFallback + "/" + fallbackUrl);
                    }
                    onElementInjectedCallback(null);
                } else {
                    onElementInjectedCallback("This browser does not support SVG and no PNG fallback was defined.");
                }
                return;
            }
            if (injections.elements.indexOf(el) !== -1) {
                console.warn("race", el);
                return;
            }
            injections.elements.push(el);
            loadSvg(onElementInjectedCallback, imgUrl, el);
        };
        SVGInjector.prototype.getEnv = function() {
            return env;
        };
        SVGInjector.prototype.getConfig = function() {
            return config;
        };
        setFallbackClassNames = function(element, symbolId, classNames) {
            var className = typeof classNames === "undefined" ? DEFAULT_FALLBACK_CLASS_NAMES : classNames.slice(0);
            forEach.call(className, function(curClassName, idx) {
                className[idx] = curClassName.replace("%s", symbolId);
            });
            svgElemSetClassName(element, className);
        };
        removeFallbackClassNames = function(element, symbolId, fallbackClassNames) {
            fallbackClassNames = typeof fallbackClassNames === "undefined" ? DEFAULT_FALLBACK_CLASS_NAMES.slice(0) : fallbackClassNames.slice(0);
            var idxOfCurClass, curClassNames, classAttribute = element.getAttribute("class");
            if (typeof classAttribute === "undefined" || classAttribute === null) {
                return;
            }
            curClassNames = classAttribute.split(" ");
            if (curClassNames) {
                forEach.call(fallbackClassNames, function(curFallbackClassName) {
                    curFallbackClassName = curFallbackClassName.replace("%s", symbolId);
                    idxOfCurClass = curClassNames.indexOf(curFallbackClassName);
                    if (idxOfCurClass >= 0) {
                        curClassNames[idxOfCurClass] = "";
                    }
                });
                element.setAttribute("class", uniqueClasses(curClassNames.join(" ")));
            }
        };
        suffixIdReferencesInStyles = function(styleTag, suffix, svg, name) {
            var numRefs = 0;
            styleTag.textContent = styleTag.textContent.replace(/url\(('|")*#.+('|")*(?=\))/g, function(match) {
                numRefs++;
                return match + "-" + suffix;
            });
            return numRefs;
        };
        suffixIdReferences = function(svg, suffix) {
            var defs = [ {
                def: "linearGradient",
                attrs: [ "fill", "stroke" ]
            }, {
                def: "radialGradient",
                attrs: [ "fill", "stroke" ]
            }, {
                def: "clipPath",
                attrs: [ "clip-path" ]
            }, {
                def: "mask",
                attrs: [ "mask" ]
            }, {
                def: "filter",
                attrs: [ "filter" ]
            }, {
                def: "color-profile",
                attrs: [ "color-profile" ]
            }, {
                def: "cursor",
                attrs: [ "cursor" ]
            }, {
                def: "marker",
                attrs: [ "marker", "marker-start", "marker-mid", "marker-end" ]
            } ];
            var newName, definitions, defLen, defIdx, refrences, refLen, refIdx, attrs, attrLen, attrIdx, allLinks, allLinksLen, allLinksIdx, links, linkLen, linkIdx;
            forEach.call(defs, function(elem) {
                definitions = svg.querySelectorAll(elem.def + "[id]");
                for (defIdx = 0, defLen = definitions.length; defIdx < defLen; defIdx++) {
                    newName = definitions[defIdx].id + "-" + suffix;
                    attrs = elem.attrs;
                    for (attrIdx = 0, attrLen = attrs.length; attrIdx < attrLen; attrIdx++) {
                        refrences = svg.querySelectorAll("[" + attrs[attrIdx] + '="url(#' + definitions[defIdx].id + ')"]');
                        for (refIdx = 0, refLen = refrences.length; refIdx < refLen; refIdx++) {
                            refrences[refIdx].setAttribute(attrs[attrIdx], "url(#" + newName + ")");
                        }
                    }
                    allLinks = svg.querySelectorAll("[*|href]");
                    links = [];
                    for (allLinksIdx = 0, allLinksLen = allLinks.length; allLinksIdx < allLinksLen; allLinksIdx++) {
                        if (allLinks[allLinksIdx].getAttributeNS(XLINK_NS, "href").toString() === "#" + definitions[defIdx].id) {
                            links.push(allLinks[allLinksIdx]);
                        }
                    }
                    for (linkIdx = 0, linkLen = links.length; linkIdx < linkLen; linkIdx++) {
                        links[linkIdx].setAttributeNS(XLINK_NS, "href", "#" + newName);
                    }
                    definitions[defIdx].id = newName;
                }
            });
        };
        copyAttributes = function(svgElemSource, svgElemTarget, attributesToIgnore) {
            var curAttr;
            if (typeof attributesToIgnore === "undefined") {
                attributesToIgnore = [ "id", "viewBox" ];
            }
            for (var i = 0; i < svgElemSource.attributes.length; i++) {
                curAttr = svgElemSource.attributes.item(i);
                if (attributesToIgnore.indexOf(curAttr.name) < 0) {
                    svgElemTarget.setAttribute(curAttr.name, curAttr.value);
                }
            }
        };
        cloneSymbolAsSVG = function(svgSymbol) {
            var svg = document.createElementNS(SVG_NS, "svg");
            forEach.call(svgSymbol.childNodes, function(child) {
                svg.appendChild(child.cloneNode(true));
            });
            copyAttributes(svgSymbol, svg);
            return svg;
        };
        doPrefixStyleTags = function(styleTag, injectCount, svg) {
            var srcArr = svg.getAttribute("data-src").split("#");
            var regex, origPrefixClassName, newPrefixClassName, srcFileNameArr, regexSearchResult, styleTagContent = styleTag.textContent, newContent = "", selectorArr, prefixSelector = function(elem, idx, arr) {
                arr[idx] = "." + newPrefixClassName + " " + elem;
            }, stylerule = "";
            if (srcArr.length > 1) {
                origPrefixClassName = srcArr[1];
                newPrefixClassName = origPrefixClassName + "-" + injectCount;
                regex = new RegExp("\\." + origPrefixClassName + " ", "g");
                styleTag.textContent = styleTagContent.replace(regex, "." + newPrefixClassName + " ");
            } else {
                srcFileNameArr = srcArr[0].split("/");
                newPrefixClassName = srcFileNameArr[srcFileNameArr.length - 1].replace(".svg", "") + "-" + injectCount;
                regex = new RegExp("([\\s\\S]*?){([\\s\\S]*?)}", "g");
                while ((regexSearchResult = regex.exec(styleTagContent)) !== null) {
                    selectorArr = regexSearchResult[1].trim().split(", ");
                    selectorArr.forEach(prefixSelector);
                    var tmp = selectorArr.join(", ") + "{" + regexSearchResult[2] + "}\n";
                    newContent += tmp;
                }
                styleTag.textContent = newContent;
            }
            svg.setAttribute("class", svg.getAttribute("class") + " " + newPrefixClassName);
        };
        getClassList = function(svgToCheck) {
            var curClassAttr = svgToCheck.getAttribute("class");
            return curClassAttr ? curClassAttr.trim().split(" ") : [];
        };
        getSpriteIdFromClass = function(element) {
            var classes = getClassList(element);
            var id = "";
            forEach.call(classes, function(curClass) {
                if (curClass.indexOf(config.spriteClassIdName) >= 0) {
                    id = curClass.replace(config.spriteClassIdName, "");
                }
            });
            return id;
        };
        cloneSvg = function(config, sourceSvg, fragId) {
            var svgElem, newSVG = null, viewBox, viewBoxAttr, symbolAttributesToFind, curClassList, setViewboxOnNewSVG = false, setDimensionsOnNewSVG = false, symbolElem = null, symobolList;
            if (fragId === undefined) {
                svgElem = newSVG = sourceSvg.cloneNode(true);
                if (!newSVG.getAttribute("width") && !sourceSvg.getAttribute("width")) {
                    setDimensionsOnNewSVG = true;
                }
            } else {
                svgElem = sourceSvg.getElementById(fragId);
                if (!svgElem) {
                    console.warn(fragId + " not found in svg");
                    return;
                }
            }
            viewBoxAttr = svgElem.getAttribute("viewBox");
            viewBox = viewBoxAttr.split(" ");
            if (!newSVG) {
                if (svgElem instanceof SVGSymbolElement) {
                    newSVG = cloneSymbolAsSVG(svgElem);
                    setDimensionsOnNewSVG = setViewboxOnNewSVG = true;
                } else if (svgElem instanceof SVGViewElement) {
                    symbolElem = null;
                    if (config.onlyInjectVisiblePart) {
                        var selector = '*[width="' + viewBox[2] + '"][height="' + viewBox[3] + '"]';
                        symbolAttributesToFind = {};
                        if (Math.abs(parseInt(viewBox[0])) === 0) {
                            selector += ":not([x])";
                        } else {
                            symbolAttributesToFind.x = viewBox[0];
                            selector += '[x="' + viewBox[0] + '"]';
                        }
                        if (Math.abs(parseInt(viewBox[1])) === 0) {
                            selector += ":not([y])";
                        } else {
                            symbolAttributesToFind.y = viewBox[1];
                            selector += '[y="' + viewBox[1] + '"]';
                        }
                        symobolList = sourceSvg.querySelectorAll(selector);
                        if (symobolList.length > 1) {
                            console.warn("more than one item, with the matching viewbox found!", symobolList);
                        }
                        symbolElem = symobolList[0];
                    }
                    if (symbolElem && symbolElem instanceof SVGSVGElement) {
                        newSVG = symbolElem.cloneNode(true);
                        for (var prop in symbolAttributesToFind) {
                            if (prop !== "width" && prop !== "height") {
                                newSVG.removeAttribute(prop);
                            }
                        }
                    } else if (symbolElem && symbolElem instanceof SVGUseElement) {
                        var referencedSymbol = sourceSvg.getElementById(symbolElem.getAttributeNS(XLINK_NS, "href").substr(1));
                        newSVG = cloneSymbolAsSVG(referencedSymbol);
                        viewBoxAttr = referencedSymbol.getAttribute("viewBox");
                        viewBox = viewBoxAttr.split(" ");
                        setDimensionsOnNewSVG = setViewboxOnNewSVG = true;
                    } else {
                        console.info((config.onlyInjectVisiblePart ? "symbol referenced via view" + fragId + " not found" : "option.onlyInjectVisiblePart: false") + " -> clone complete svg!");
                        setDimensionsOnNewSVG = setViewboxOnNewSVG = true;
                        newSVG = sourceSvg.cloneNode(true);
                    }
                }
                curClassList = getClassList(newSVG);
                var fragIdClassName = config.prefixFragIdClass + fragId;
                if (curClassList.indexOf(fragIdClassName) < 0) {
                    curClassList.push(fragIdClassName);
                    newSVG.setAttribute("class", curClassList.join(" "));
                }
            }
            if (setViewboxOnNewSVG) {
                newSVG.setAttribute("viewBox", viewBox.join(" "));
            }
            if (setDimensionsOnNewSVG) {
                newSVG.setAttribute("width", viewBox[2] + "px");
                newSVG.setAttribute("height", viewBox[3] + "px");
            }
            newSVG.setAttribute("xmlns", SVG_NS);
            newSVG.setAttribute("xmlns:xlink", XLINK_NS);
            return newSVG;
        };
        queueRequest = function(fileName, fragId, callback, el) {
            requestQueue[fileName] = requestQueue[fileName] || [];
            requestQueue[fileName].push({
                callback: callback,
                fragmentId: fragId,
                element: el,
                name: name
            });
        };
        processRequestQueue = function(url) {
            var requestQueueElem;
            for (var i = 0, len = requestQueue[url].length; i < len; i++) {
                (function(index) {
                    setTimeout(function() {
                        requestQueueElem = requestQueue[url][index];
                        onLoadSVG(url, requestQueueElem.fragmentId, requestQueueElem.callback, requestQueueElem.element, requestQueueElem.name);
                    }, 0);
                })(i);
            }
        };
        loadSvg = function(onElementInjectedCallback, url, el) {
            var urlArr, fileUrl, fragId, name, pathArr;
            urlArr = url.split("#");
            fileUrl = urlArr[0];
            fragId = urlArr.length === 2 ? urlArr[1] : undefined;
            if (typeof fragId !== "undefined") {
                pathArr = fileUrl.split("/");
                name = pathArr[pathArr.length - 1].replace(".svg", "");
            }
            if (svgCache[fileUrl] !== undefined) {
                if (svgCache[fileUrl] instanceof SVGSVGElement) {
                    onLoadSVG(fileUrl, fragId, onElementInjectedCallback, el, name);
                } else {
                    queueRequest(fileUrl, fragId, onElementInjectedCallback, el, name);
                }
            } else {
                if (!window.XMLHttpRequest) {
                    onElementInjectedCallback("Browser does not support XMLHttpRequest");
                    return false;
                }
                svgCache[fileUrl] = {};
                queueRequest(fileUrl, fragId, onElementInjectedCallback, el, name);
                var httpRequest = new XMLHttpRequest();
                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 404 || httpRequest.responseXML === null) {
                            onElementInjectedCallback("Unable to load SVG file: " + fileUrl);
                            return false;
                        }
                        if (httpRequest.status === 200 || env.isLocal && httpRequest.status === 0) {
                            if (httpRequest.responseXML instanceof Document) {
                                svgCache[fileUrl] = httpRequest.responseXML.documentElement;
                            } else if (DOMParser && DOMParser instanceof Function) {
                                var xmlDoc;
                                try {
                                    var parser = new DOMParser();
                                    xmlDoc = parser.parseFromString(httpRequest.responseText, "text/xml");
                                } catch (e) {
                                    xmlDoc = undefined;
                                }
                                if (!xmlDoc || xmlDoc.getElementsByTagName("parsererror").length) {
                                    onElementInjectedCallback("Unable to parse SVG file: " + url);
                                    return false;
                                } else {
                                    svgCache[fileUrl] = xmlDoc.documentElement;
                                }
                            }
                            processRequestQueue(fileUrl);
                        } else {
                            onElementInjectedCallback("There was a problem injecting the SVG: " + httpRequest.status + " " + httpRequest.statusText);
                            return false;
                        }
                    }
                };
                httpRequest.open("GET", fileUrl);
                if (httpRequest.overrideMimeType) httpRequest.overrideMimeType("text/xml");
                httpRequest.send();
            }
        };
        writeDefaultClass = function(removeStylesClass) {
            var css = "svg." + removeStylesClass + " {fill: currentColor;}", head = document.head || document.getElementsByTagName("head")[0], style = document.createElement("style");
            style.type = "text/css";
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);
        };
        replaceNoSVGClass = function(element, noSVGClassName, hasSvgSupport) {
            if (hasSvgSupport) {
                element.className.replace(noSVGClassName, "");
            } else {
                element.className += " " + noSVGClassName;
            }
        };
        onLoadSVG = function(url, fragmentId, onElementInjectedCallback, el, name) {
            var svg, imgId, titleId, descId, ariaHidden, fallbackSvg, labeledBy, titleTagExisting, descTagExisting;
            svg = cloneSvg(config, svgCache[url], fragmentId);
            if (typeof svg === "undefined" || typeof svg === "string") {
                fallbackSvg = el.getAttribute("data-fallback-svg");
                fallbackSvg = fallbackSvg || config.svgFallbackDir ? config.svgFallbackDir + "/" + fragmentId + ".svg" : false;
                if (fallbackSvg) {
                    el.setAttribute("data-src", fallbackSvg);
                    injections.elements.splice(injections.elements.indexOf(el), 1);
                    injectElement(el, onElementInjectedCallback);
                } else {
                    onElementInjectedCallback(svg);
                }
                return false;
            }
            svg.setAttribute("role", "img");
            forEach.call(svg.children || [], function(curChildElem) {
                if (!(curChildElem instanceof SVGDefsElement) && !(curChildElem instanceof SVGTitleElement) && !(curChildElem instanceof SVGDescElement)) {
                    curChildElem.setAttribute("role", "presentation");
                }
            });
            ariaHidden = el.getAttribute("aria-hidden") || svg.getAttribute("aria-hidden");
            if (ariaHidden) {
                svg.setAttribute("aria-hidden", "true");
                titleTagExisting = svg.querySelector("title");
                descTagExisting = svg.querySelector("desc");
                if (titleTagExisting) {
                    svg.removeChild(titleTagExisting);
                }
                if (descTagExisting) {
                    svg.removeChild(descTagExisting);
                }
            } else {
                descId = setRootLevelElem("desc", svg, el, fragmentId, false);
                titleId = setRootLevelElem("title", svg, el, fragmentId, false);
                if (descId.length > 0 || titleId.length > 0) {
                    labeledBy = titleId + " " + descId;
                    svg.setAttribute("aria-labelledby", labeledBy.trim());
                }
            }
            copyAttributes(el, svg, [ "class" ]);
            var classMerge = [].concat(svg.getAttribute("class") || [], "injected-svg", el.getAttribute("class") || []).join(" ");
            svg.setAttribute("class", uniqueClasses(classMerge));
            suffixIdReferences(svg, injections.count, name);
            svg.removeAttribute("xmlns:a");
            var scripts = svg.querySelectorAll("script");
            var scriptsToEval = [];
            var script, scriptType;
            for (var k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
                scriptType = scripts[k].getAttribute("type");
                if (!scriptType || scriptType === "application/ecmascript" || scriptType === "application/javascript") {
                    script = scripts[k].innerText || scripts[k].textContent;
                    scriptsToEval.push(script);
                    svg.removeChild(scripts[k]);
                }
            }
            if (scriptsToEval.length > 0 && (config.evalScripts === "always" || config.evalScripts === "once" && !ranScripts[url])) {
                for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {
                    new Function(scriptsToEval[l])(window);
                }
                ranScripts[url] = true;
            }
            var styleTags = svg.querySelectorAll("style");
            forEach.call(styleTags, function(styleTag) {
                var svgClassList = getClassList(svg), stylesUntouched = true;
                if ((svgClassList.indexOf(config.removeStylesClass) >= 0 || config.removeAllStyles) && svgClassList.indexOf(config.keepStylesClass) < 0) {
                    styleTag.parentNode.removeChild(styleTag);
                } else {
                    if (suffixIdReferencesInStyles(styleTag, injections.count, svg, name) > 0) {
                        stylesUntouched = false;
                    }
                    if (config.prefixStyleTags) {
                        doPrefixStyleTags(styleTag, injections.count, svg, name);
                        stylesUntouched = false;
                    }
                    if (stylesUntouched) {
                        styleTag.textContent += "";
                    }
                }
            });
            el.parentNode.replaceChild(svg, el);
            delete injections.elements[injections.elements.indexOf(el)];
            injections.count++;
            onElementInjectedCallback(svg);
        };
        uniqueClasses = function(list) {
            list = list.split(" ");
            var hash = {};
            var i = list.length;
            var out = [];
            while (i--) {
                if (!hash.hasOwnProperty(list[i])) {
                    hash[list[i]] = 1;
                    out.unshift(list[i]);
                }
            }
            return out.join(" ");
        };
        isFunction = function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        };
        isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
        svgElemSetClassName = function(el, newClassNames) {
            var curClasses = el.getAttribute("class");
            curClasses = curClasses ? curClasses : "";
            if (isArray(newClassNames)) {
                newClassNames = newClassNames.join(" ");
            }
            newClassNames = curClasses + " " + newClassNames;
            el.setAttribute("class", uniqueClasses(newClassNames));
        };
        forEach = Array.prototype.forEach || function(fn, scope) {
            if (this === void 0 || this === null || typeof fn !== "function") {
                throw new TypeError();
            }
            var i, len = this.length >>> 0;
            for (i = 0; i < len; ++i) {
                if (i in this) {
                    fn.call(scope, this[i], i, this);
                }
            }
        };
        setRootLevelElem = function(type, svg, el, fragmentId, addDefault) {
            var elemId = fragmentId ? fragmentId + "-" : "", existingElem;
            elemId += type + "-" + injections.count;
            existingElem = el.querySelector(type);
            if (existingElem) {
                addRootLevelElem(type, svg, existingElem.textContent, elemId, svg.firstChild);
            } else {
                existingElem = svg.querySelector(type);
                if (existingElem) {
                    existingElem.setAttribute("id", elemId);
                } else {
                    if (addDefault) {
                        console.log("add default");
                        addRootLevelElem(type, svg, fragmentId, elemId, svg.firstChild);
                    } else {
                        elemId = "";
                    }
                }
            }
            return elemId;
        };
        addRootLevelElem = function(type, svg, text, id, insertBefore) {
            var newElem, existingElem = svg.querySelector(type);
            newElem = document.createElementNS(SVG_NS, type);
            newElem.appendChild(document.createTextNode(text));
            newElem.setAttribute("id", id);
            svg.insertBefore(newElem, insertBefore);
            if (existingElem) {
                existingElem.parentNode.removeChild(existingElem);
            }
            return newElem;
        };
        return SVGInjector;
    }();
    if (typeof angular === "object") {
        angular.module("svginjector", []).provider("svgInjectorOptions", function() {
            var injectorOpts = {};
            return {
                set: function(opts) {
                    injectorOpts = opts;
                },
                $get: function() {
                    return injectorOpts;
                }
            };
        }).factory("svgInjectorFactory", [ "svgInjectorOptions", function(svgInjectorOptions) {
            return new SVGInjector(svgInjectorOptions);
        } ]).directive("svg", [ "svgInjectorFactory", function(svgInjectorFactory) {
            var cfg = svgInjectorFactory.getConfig();
            return {
                restrict: "E",
                link: function(scope, element, attrs) {
                    if (attrs["class"] && attrs["class"].indexOf(cfg.spriteClassIdName) >= 0) {
                        attrs.$observe("class", function() {
                            svgInjectorFactory.inject(element[0]);
                        });
                    } else if (attrs.dataSrc || attrs.src) {
                        svgInjectorFactory.inject(element[0]);
                    }
                }
            };
        } ]);
    } else {
        if (typeof module === "object" && typeof module.exports === "object") {
            module.exports = SVGInjector;
        } else if (typeof define === "function" && define.amd) {
            define(function() {
                return SVGInjector;
            });
        } else if (typeof window === "object") {
            window.SVGInjector = SVGInjector;
        }
    }
})(window, document);