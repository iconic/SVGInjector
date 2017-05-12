SVGInjector
=========

A fast, caching, dynamic inline SVG DOM injection library. Originally developed by [Waybury](http://waybury.com/) for use in [iconic.js](https://useiconic.com/tools/iconic-js/), part of the [Iconic](https://useiconic.com/) icon system.
Extended by Flobacher to be able to use with spritesheets and in AngularJS Applications

## Why?
Linking to an external SVG on a page (via `object`, `embed`, `iframe`, `img`, CSS `background-image`) usually only allows you to display the SVG 'as is'. To unlock the full potential of SVG, including full element-level CSS styling and evaluation of embedded JavaScript, the markup of the SVG must be included directly in the DOM.

Maintaining a bunch of inline SVG on your pages isn't anyone's idea of good time, so **SVGInjector** lets you specify external SVGs and embeds the contents directly into the DOM alongside your HTML.

## How?
* Any DOM element or array of elements (recommended are `svg`-tags for clarity or `img`-tags if you need support for fallback pngs, but there are no technical limitations), passed to **SVGInjector** that contains a `data-src` attribute will be replaced with the full SVG markup available via this URL inline. The async loaded SVG is also cached so multiple uses of an SVG only requires a single server request.

* Any embedded JavaScript in the SVG will optionally be extracted, cached and evaluated.

> Development tip: The dynamic injection process uses AJAX calls to load SVG. If you are developing locally without running a local webserver, be aware that default browser security settings may [block these calls](http://wiki.fluidproject.org/display/fluid/Browser+settings+to+support+local+Ajax+calls).


# Documentation

## Install

> **SVGInjector2** is compatible with:
  * [CommonJS](http://commonjs.org/) via `module.exports` for use with [Browserify](http://browserify.org/) or [Node](http://nodejs.org/)/[PhantomJS](http://phantomjs.org/)
  * [AMD API](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) usage with [RequireJS](http://requirejs.org/)
  * Plain ol' JavaScript via creation of a global function
  * AngularJS

### npm

    npm install svg-injector-2

### Bower

    bower install svg-injector-2

### Manually

Download the [dist/svg-injector.min.js](https://github.com/flobacher/SVGInjector2/blob/master/dist/svg-injector.min.js) file from this repository and add it to your project.


## Usage

### Quick Start

Include the **SVGInjector** script on your page.

```html
<script src="svg-injector.min.js"></script>
```

Add some `svg` tags.

```html
<svg data-src="image-one.svg" />
<svg data-src="image-two.svg" />
```

Inject 'em.

```html
<script>
  // Do the injection for the selected Nodelist
  new SVGInjector().inject(document.querySelectorAll('svg[data-src]'));
</script>
```

The `svg` tags have now been replaced with the full SVG markup.

Also see [examples/simple](https://github.com/flobacher/SVGInjector2/blob/master/examples/simple.html) for another example that illustrates how to inject `svg` elements using `data-src` with a specific classname such as `inject-me`.


### Full Example incl. Configuration

In addition to passing elements to inject, an options object to configure the injector instance and callback functions for the injections can optionally be defined.


```html
<svg id="image-one" data-src="image-one.svg">
<svg id="image-two" data-src="image-two.svg">
```

```js
// Elements to inject
var elementsToInject = document.querySelectorAll('svg[data-src]');

// Options
var injectorOptions = {
  evalScripts: 'once',
  pngFallback: 'assets/png'
};

var afterAllInjectionsFinishedCallback = function (totalSVGsInjected) {
  // Callback after all SVGs are injected
  console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
};

var perInjectionCallback = function (svg) {
  // Callback after each SVG is injected
  console.log('SVG injected: ' + svg);
};

// create injector configured by options
var injector = new SVGInjector(injectorOptions);

// Trigger the injection
injector.inject(
  elementsToInject,
  afterAllInjectionsFinishedCallback,
  perInjectionCallback
);
```
Also see [examples/everything](https://github.com/flobacher/SVGInjector2/blob/master/examples/everything.html) for more details.

#### `options`

```js
// default values as comment after the line
{
  evalScripts: 'always'|'once'|'never', // 'always'
  pngFallback: 'url to directory with fallbackpngs', // false
  keepStylesClass: 'className', // ''
  spriteClassName: 'className', // 'sprite'
  spriteClassIdName: 'classNameInclSeperator', // 'sprite--'
  removeStylesClass: 'className', // 'icon' -> this will remove all styles from the svg so it is easy to style with external css. works best with monochrome icons
  removeAllStyles: true|false, // false
  fallbackClassName: 'className', // 'sprite'
  prefixStyleTags: true|false, // true

  // spritesheet relevant options
  spritesheetURL: 'urlToSpritesheet', false // only needed for classbased injection
  onlyInjectVisiblePart: true|false, // true -> if the fragmentId specifies an svg-view element, only inject the part that is visible due to the specified view
  svgFallbackDir: 'urlToFragmentsThatMightNotBeInSpritesheetAnymore', // false -> it can make sense to remove fragments from a spritesheet after some time.. to be sure that nothin breaks, they can be put as single files to a fallback directory and injector tries to find them there
  

  // testing
  forceFallbacks: true|false, // false
}
```

* `evalScript` - String

  Should we run any script blocks found in the SVG?

  * `always` - Run them every time.
  * `once` - [default] Only run scripts once for each SVG file, even if it is used on a page more than once.
  * `[false|'never']` - Ignore scripts

* `pngFallback` - String

  The directory where fallback PNGs are located for use if the browser doesn't [support SVG](http://caniuse.com/svg). This will look for a file with a `.png` extension matching the SVG filename defined in the `data-src`. For this to work, use `img` instead of `svg` elements.

  For additional flexibility, per-element fallbacks are also [available](#per-element-png-fallback).


#### `elements`

A single DOM element or array of elements, with `data-src` attributes defined, to inject.


#### `perInjectionCallback(svg)` - function

  A function to call after each SVG is injected. Receives the newly injected SVG DOM element as a parameter.

#### `afterAllInjectionsFinishedCallback(count)` - function

A function to call once all the requested SVG elements have been injected. Receives a count of the total SVGs injected as a parameter.



### Per-element PNG fallback

Since you might be using a single SVG styled in multiple ways, you can also define per-element fallbacks by adding a `data-fallback` or `data-png` attribute to your `img` tags (remember for png fallbacks to work you need to use img-tags) to define a unique PNG for each context.

See [examples/fallbacks](https://github.com/flobacher/SVGInjector2/blob/master/examples/fallbacks.html) for more details.

```html
<style>
  .thumb-green {fill: #A6A93C;}
</style>
<img class="thumb-green inject-me" data-src="svg/thumb-up.svg" data-fallback="png/thumb-up-green.png" />

```

### Spritesheets

To save http requests, you can combine your svgs to a spritesheet, where every single svg is represented
as a `<symbol>` or an `<svg>`. To inject the symbol with the id `thumb-up` from a spritesheet, on the element where you want
the injection to happen write :  `data-src = "url-to-spritesheet.svg#thumb-up"`.
Besides spritesheets consisting of symbols, you can also use Spritesheets that specify `<view>` elements with
ids (it is possible to create a fallback-png spritesheet for those). The injector will try to find the symbol/svg element
via comparing its viewbox to that of the view. If no png fallback is needed, the first approach is the most
prefereable. If using nodejs build-tools like gulp or grunt, take a look at [svg-sprite](https://github.com/jkphl/svg-sprite).
See [examples/spritesheet](https://github.com/flobacher/SVGInjector2/blob/master/examples/angular-spritesheet.html) for more details.

#### Classbased fragment ids

When using spritesheets, having to type the same data-src=urltospritesheet.svg#fragmentid can become cumbersome.
Thats why there is a config options that allows to set a default url to a spritesheet. The fragment id can then be provided via
a simple class.
See [examples/fallbacks](https://github.com/flobacher/SVGInjector2/blob/master/examples/spritesheet-classbased.html) for more details.
There is an additional option to add a fallback svg in case the fragmentid cannot be found in the spritesheet.
Specify it via `data-fallback-svg = "url-to-fallback-image.svg"`

### AngularJS

SVGInjector is also available as configurable Service / Directive combination.
The svg-element-directive will automatically inject the svg. Just define the `svginjector` module as a dependency of your module.
See [examples/angular-simple](https://github.com/flobacher/SVGInjector2/blob/master/examples/angular-simple.html) for more details.

To configure the SVGInjector Service use the svgInjectorOptionsProvider available during the config-phase and use it to set
the options-object. For details
see [examples/angular-spritesheet](https://github.com/flobacher/SVGInjector2/blob/master/examples/angular-spritesheet.html).
This example also demonstrates, that of course the angular wrapper can also be used in combination with a spritesheet.

Last but not least check [examples/angular-spritesheet-classbased](https://github.com/flobacher/SVGInjector2/blob/master/examples/angular-spritesheet-classbased.html) to see the convenience the use of classbased injection offers.


#### Performance tip
add
```html
<link rel="prefetch" href="(pathToSpritesheet)"/>
```
to let the browser download the file, even before it was requested via xhr

### Accessibility
`role="img"` and `aria-labelledby` gets added to the root svg element. `aria-labelledby` points to the id of the `desc` and `title` tags inside the injected svg.
The contents of those tags comes from corresponding tags inside the element which is the injection target, if not found there, they are taken from the svg-instance that gets
injected, and if missing there as well defaults to the fragmentid or filename of the injectable. `role="presentation"` gets added to all elements
in all proper browsers (so no IE).



# Licence
The MIT License (MIT)

Copyright (c) 2014 Waybury

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
