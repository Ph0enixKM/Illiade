tippy('[data-tippy-content]', {
    theme: 'dark',
    arrow: false
})

window.onload = () => {
    setTimeout(() => {
        $('.inputarea').focus()
    }, 500)
}

// Polyfill - return last element
Array.prototype.last = function () {
    return this[this.length - 1]
}
String.prototype.last = function () {
    return this[this.length - 1]
}