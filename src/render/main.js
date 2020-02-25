import fs from 'fs-extra'
import path from 'path'

tippy('[data-tippy-content]', {
    theme: 'dark',
    arrow: false,
    boundary: 'viewport',
    appendTo: document.body,
    placement: 'bottom'
})

// Set focus on editor
EDITOR_LOAD.trigger(() => {
    setTimeout(() => {
        if (!EXT_UNSAVABLE.val.includes(OpenedAPI.get('extension'))) {
            $('.inputarea').focus()
        }
    }, 500)
})

window.addEventListener('DOMContentLoaded', () => {
    let version = document.querySelector('#version')
    version.innerHTML = VERSION_LEVEL.val
})

// Update All icons
fs.readdir(path.join(__dirname, '../../art/icons'), (err, files) => {
    files.forEach(file => {
        ICONS.push(file)
    })
})

// Polyfill - return last element
Array.prototype.last = function () {
    return this[this.length - 1]
}
String.prototype.last = function () {
    return this[this.length - 1]
}