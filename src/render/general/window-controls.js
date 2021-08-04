const {remote} = require('electron')

const win = remote.getCurrentWindow()

// Close Window
$('#exit').addEventListener('click', () => {
    win.close()
})


// Minimize Window
$('#min').addEventListener('click', () => {
    win.minimize()
})


if (process.platform === 'darwin') {
    $('#title-cont').addEventListener('dblclick', () => {
        if (win.isMaximized()) {
            win.unmaximize()
        }
        else {
            win.maximize()
        }
    })
    $('#max').addEventListener('click', () => {
        if (win.isFullScreen()) {
            win.setFullScreen(false)
        }
        else {
            win.setFullScreen(true)
        }
    })
}
else {
    // Maximize Window
    $('#max').addEventListener('click', () => {
        if (win.isMaximized()) {
            win.unmaximize()
        }
        else {
            win.maximize()
        }
    })

}


// On resize - save the window dimension
let resizeTime = null
window.addEventListener('resize', e => {
    clearTimeout(resizeTime)
    resizeTime = setTimeout(() => {
        storage.set('WINDOW_SIZE', win.getSize())
    }, 100)
})

// On move - save the window position
let moveTime = null
win.on('move', e => {
    clearTimeout(moveTime)
    moveTime = setTimeout(() => {
        storage.set('WINDOW_POS', win.getPosition())
    }, 100)
})

// When Maximized - save the window rect
win.on('maximize', e => {
    storage.set('WINDOW_SIZE', win.getSize())
    storage.set('WINDOW_POS', win.getPosition())
})

// When Unaximized - save the window rect
win.on('unmaximize', e => {
    storage.set('WINDOW_SIZE', win.getSize())
    storage.set('WINDOW_POS', win.getPosition())
})

if (DEBUG === true)
window.addEventListener('keydown', (e) =>  {
    if (e.key === 'F6')
        win.toggleDevTools()
    else if (e.key === 'F5')
        win.reload()
})