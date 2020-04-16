import fs from 'fs-extra'
import path from 'path'
import { remote } from 'electron'
import watchdog from 'native-watchdog'

// Watch this process.
// When Illiade freezez
// dog's gonna kill it.
watchdog.start(process.pid)

// Resize window to the lastly saved dimensions
const win = remote.getCurrentWindow()
win.setSize(...WINDOW_SIZE.val, true)


// Position window to the last place
if(!WINDOW_POS.val.includes(null))  {
    const win = remote.getCurrentWindow()
    win.setPosition(...WINDOW_POS.val)
}

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

// On DOM Load
window.addEventListener('DOMContentLoaded', () => {
    let version = document.querySelector('#version')
    version.innerHTML = VERSION_LEVEL.val
})

// Update All icons
fs.readdir(path.join(__dirname, '../../art/icons'), (err, files) => {
    if (files == undefined) return null
    files.forEach(file => {
        ICONS.push(file)
    })
})

// Update all project files
fs.readdir(ROOT.val, (err, files) => {
    if (files == undefined) return null
    files.forEach(file => {
        if (file === '.illiade') {
            SAVE_PROJECT_CONFIG.val = true
        }
    })
})

// clear console
EDITOR_LOAD.trigger(() => {
    updateTree()
    console.log(
        `%cIlliade ${VERSION_LEVEL.val}`,
        `   
            color: #BF00A8;
            font-family: Lato, Verdana;
            font-size: 30px;
        `
    )
})
