// It's not a library it's rather
// a polyfill of some functionalities
// which are required by Illiade
// and some boilerplate code
// that is needed to be run
// before everythng.


// This variable fixes babel
// ES Module requirement issue
window.exports = {"__esModule": true}

// Query Selector Shortcut
// Adds some jQuery vibe
// yet keeps things lightweight
function $(query) {
    return document.querySelector(query)
}

// Polyfill enable arrays to easily
// return the last element with a
// sintatical sugar on top
Array.prototype.last = function () {
    return this[this.length - 1]
}

// Polyfill enable strings to easily
// return the last element with a
// sintatical sugar on top
String.prototype.last = function () {
    return this[this.length - 1]
}
