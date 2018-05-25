import cloneSvg from './clone-svg'
import svgCache from './svg-cache'

const requestQueue = []

export const queueRequest = (url, callback) => {
  requestQueue[url] = requestQueue[url] || []
  requestQueue[url].push(callback)
}

export const processRequestQueue = url => {
  for (let i = 0, len = requestQueue[url].length; i < len; i++) {
    // Make these calls async so we avoid blocking the page/renderer
    /* jshint loopfunc: true */
    ;(function(index) {
      setTimeout(function() {
        requestQueue[url][index](cloneSvg(svgCache[url]))
      }, 0)
    })(i)
    /* jshint loopfunc: false */
  }
}
