tippy('[data-tippy-content]', {
    theme: 'dark',
    arrow: false
})

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        $('.inputarea').focus()
    }, 500)

    let version = document.querySelector('#version')
    version.innerHTML = VERSION_LEVEL.val
})

// Polyfill - return last element
Array.prototype.last = function () {
    return this[this.length - 1]
}
String.prototype.last = function () {
    return this[this.length - 1]
}