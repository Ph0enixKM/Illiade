const panel = $('#panel')
const panelBig = $('#panel .big')
const panelCompact = $('#panel .compact')

// This function controlls the panel behavior
// which is adapting icons to the left panel size.
LEFT_PANEL_SIZE.trigger(val => {
    if (val < 135) {
        for (const col of panelBig.children) {
            for (const button of col.children) {
                button.classList.remove('on')
            }
        }
        panelCompact.style.display = 'block'
        panelBig.style.display = 'none'
        setTimeout(() => {
            for (const col of panelCompact.children) {
                for (const button of col.children) {
                    button.classList.add('on')
                }
            }
        }, 100)
    }
    else {
        for (const col of panelCompact.children) {
            for (const button of col.children) {
                button.classList.remove('on')
            }
        }
        panelBig.style.display = 'block'
        panelCompact.style.display = 'none'
        setTimeout(() => {
            for (const col of panelBig.children) {
                for (const button of col.children) {
                    button.classList.add('on')
                }
            }
        }, 100)
    }
})

// On open the apps button
const appsButtons = document.querySelectorAll('#apps-button')
for (const apps of appsButtons) {
    apps.addEventListener('click', e => {
        APPS_DOCK_SHOW.val = !APPS_DOCK_SHOW.val
        storage.set('APPS_DOCK_SHOW', APPS_DOCK_SHOW.val)
    })
}

// On (keyboard shortcut) open the apps button
new Shortcut('ALT A', e => {
    APPS_DOCK_SHOW.val = !APPS_DOCK_SHOW.val
})

// Update Apps when opened or hidden
const dock = $('#dock-apps')
APPS_DOCK_SHOW.trigger(show => {
    if (show) {
        $err.spawn('This feature will be working soon')
        dock.classList.add('on')
    }
    else {
        dock.classList.remove('on')
    }
})