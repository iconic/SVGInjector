SVGInjector
=========

Fast, caching, dynamic inline SVG DOM injection library.

Developed by [Waybury](http://waybury.com/) for use in [iconic.js](https://useiconic.com/tools/iconic-js/), part of the [Iconic](https://useiconic.com/) icon system.

## Why?
There are a number of ways to use SVG on a page (`object`, `embed`, `iframe`, `img`, CSS `background-image`) but to unlock the full potential of SVG, including full element-level CSS styling and evaluation of embedded JavaScript, the full SVG markup must be included directly in the DOM. 

Wrangling and maintaining a bunch of inline SVG on your pages isn't anyone's idea of good time, so `SVGInjector` lets you work with simple `img` tag elements and does the heavy lifting of swapping in the SVG markup inline for you.

## How?
* Any DOM element, or array of elements, passed to `SVGInjector` with an SVG file `src` or `data-src` attribute will be replaced with the full SVG markup inline. The async loaded SVG is also cached so multiple uses of an SVG only requires a single server request.

* Any embedded JavaScript in the SVG will optionally be extracted, cached and evaluated.

> Development tip: The dynamic injection process uses AJAX calls to load SVG. If you are developing locally without running a local webserver, be aware that default browser security settings may [block these calls](http://wiki.fluidproject.org/display/fluid/Browser+settings+to+support+local+Ajax+calls).



# Documentation

## Install

Download the [svg-injector.js]() or [dist/svg-injector.min.js]() file from this repository.

`SVGInjector` is compatible with:

* [CommonJS](http://commonjs.org/) via `module.exports` for use with [Browserify](http://browserify.org/) or [Node](http://nodejs.org/)/[PhantomJS](http://phantomjs.org/)
* [AMD API](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) usage with [RequireJS](http://requirejs.org/)
* Plain ol' JavaScript via creation of a global function

## Usage

Add `SVGInjector` to your page:

```html
<script src="svg-injector.min.js"></script>
```

Add some SVG `img` tags:

```html
<img id="image-one" class="inject-these-svgs" src="image-one.svg">
<img id="image-two" class="inject-these-svgs" src="image-two.svg">
```

Inject 'em:

```js
// Elements to inject
var mySVGsToInject = document.querySelectorAll('img.inject-these-svgs');

SVGInjector(mySVGsToInject,
{
  evalScripts: 'once',
  pngFallback: 'assets/png',
  each: function(svg) {
    // Callback after each SVG is injected
    console.log('SVG injected: ' + svg.getAttribute('id'));
  }
},
function(totalSVGsInjected) {
  // Callback after all SVGs are injected
  console.log('We injected ' + totalSVGsInjected + ' SVGs!');
});
```

### Configuration

```js
SVGInjector(elements, options, callback);
```

---

### `elements`

A single DOM element or array of elements to inject.

---

### `options`

```js
{
  evalScripts: [always|once|never],
  pngFallback: [png directory],
  each: [function]
}
```

####`evalScript`

Should we run any script blocks found in the SVG?

* `always` - Run them every time.
* `once` - [default] Only run scripts once for each SVG file, even if it is used on a page more than once.
* `[false|'never']` - Ignore scripts

#### `pngFallback`

The directory where fallback PNGs are located for use if the browser doesn't [support SVG](http://caniuse.com/svg).

#### `each`

A function to call after each SVG is injected.

---

### `callback`

A function to call once all the requested SVG elements have been injected.


# Licence
The MIT License (MIT)

Copyright (c) 2014 Waybury

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
