"use strict";function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}(function(a,b){function c(a){a=a.split(" ");for(var b={},c=a.length,d=[];c--;)b.hasOwnProperty(a[c])||(b[a[c]]=1,d.unshift(a[c]));return d.join(" ")}var d=b.implementation,e="file:"==a.location.protocol,f=d.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),g=Array.prototype.forEach||function(a,b){if(null==this||null==this||"function"!=typeof a)throw new TypeError;var c,d=this.length>>>0;for(c=0;c<d;++c)c in this&&a.call(b,this[c],c,this)},h={},j=0,m=[],n=[],o={},p=function(a){return a.cloneNode(!0)},q=function(a,b){n[a]=n[a]||[],n[a].push(b)},r=function(a){for(var b=0,c=n[a].length;b<c;b++)(function(b){setTimeout(function(){n[a][b](p(h[a]))},0)})(b)},s=function(b,c){if(a.SVGSVGElement)if(void 0!==h[b])h[b]instanceof SVGSVGElement?c(p(h[b])):q(b,c);else{if(!a.XMLHttpRequest)return c("Browser does not support XMLHttpRequest"),!1;h[b]={},q(b,c);var d=new XMLHttpRequest;d.onreadystatechange=function(){if(4==d.readyState){if(404==d.status||null==d.responseXML)return c("Unable to load SVG file: ".concat(b)),e&&c("Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver."),c(),!1;if(200==d.status||e&&0==d.status){if(d.responseXML instanceof Document)h[b]=d.responseXML.documentElement;else if(DOMParser&&DOMParser instanceof Function){var a;try{var f=new DOMParser;a=f.parseFromString(d.responseText,"text/xml")}catch(b){a=void 0}if(!a||a.getElementsByTagName("parsererror").length)return c("Unable to parse SVG file: ".concat(b)),!1;h[b]=a.documentElement}r(b)}else return c("There was a problem injecting the SVG: ".concat(d.status," ").concat(d.statusText)),!1}},d.open("GET",b),d.overrideMimeType&&d.overrideMimeType("text/xml"),d.send()}},t=function(b,d,e,h){var i=b.getAttribute("data-src")||b.getAttribute("src");if(!/\.svg/i.test(i))return void h("Attempted to inject a file with a non-svg extension: ".concat(i));if(!f){var k=b.getAttribute("data-fallback")||b.getAttribute("data-png");return void(k?(b.setAttribute("src",k),h(null)):e?(b.setAttribute("src","".concat(e,"/").concat(i.split("/").pop().replace(".svg",".png"))),h(null)):h("This browser does not support SVG and no PNG fallback was defined."))}m.includes(b)||(m.push(b),b.setAttribute("src",""),s(i,function(e){if("undefined"==typeof e||"string"==typeof e)return h(e),!1;var f=b.getAttribute("id");f&&e.setAttribute("id",f);var n=b.getAttribute("title");n&&e.setAttribute("title",n);var p=[].concat(e.getAttribute("class")||[],"injected-svg",b.getAttribute("class")||[]).join(" ");e.setAttribute("class",c(p));var q=b.getAttribute("style");q&&e.setAttribute("style",q);var r=[].filter.call(b.attributes,function(a){var b=a.name;return /^data-\w[\w\-]*$/.test(b)||"onclick".match(b)});g.call(r,function(a){var b=a.name,c=a.value;b&&c&&e.setAttribute(b,c)});var s,t,u,v,w,x={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],pattern:["fill","stroke"],radialGradient:["fill","stroke"]};Object.keys(x).forEach(function(a){s=a,u=x[a],t=e.querySelectorAll("defs ".concat(s,"[id]"));for(var b=function _loop(a,b){v=t[a].id,w="".concat(v,"-").concat(j);var c;g.call(u,function(a){c=e.querySelectorAll("[".concat(a,"*=\"").concat(v,"\"]"));for(var b=0,d=c.length;b<d;b++)c[b].setAttribute(a,"url(#".concat(w,")"))}),t[a].id=w},c=0,d=t.length;c<d;c++)b(c,d)}),e.removeAttribute("xmlns:a");for(var y,z,A=e.querySelectorAll("script"),B=[],C=0,D=A.length;C<D;C++)z=A[C].getAttribute("type"),z&&"application/ecmascript"!=z&&"application/javascript"!=z||(y=A[C].innerText||A[C].textContent,B.push(y),e.removeChild(A[C]));if(0<B.length&&("always"==d||"once"==d&&!o[i])){for(var F=0,l=B.length;F<l;F++)new Function(B[F])(a);o[i]=!0}var E=e.querySelectorAll("style");g.call(E,function(a){a.textContent+=""}),b.parentNode.replaceChild(e,b),delete m[m.indexOf(b)],b=null,j++,h(e)}))},u=function SVGInjector(a){var b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:{},c=2<arguments.length?arguments[2]:void 0,d=b.evalScripts||"always",e=b.pngFallback||!1,f=b.each;if(a&&a.length!==void 0){var h=0;g.call(a,function(b){t(b,d,e,function(b){f&&"function"==typeof f&&f(b),c&&a.length==++h&&c(h)})})}else a?t(a,d,e,function(b){f&&"function"==typeof f&&f(b),c&&c(1),a=null}):c&&c(0)};"object"==("undefined"==typeof module?"undefined":_typeof(module))&&"object"==_typeof(module.exports)?module.exports=exports=u:"function"==typeof define&&define.amd?define(function(){return u}):"object"==_typeof(a)&&(a.SVGInjector=u)})(window,document);
//# sourceMappingURL=svg-injector.js.map