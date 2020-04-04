// This file controlls the panel behavior
// which is adapting icons to the left panel size.

const panel = $('#panel')
const panelBig = $('#panel .big')
const panelCompact = $('#panel .compact')

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


const mores = document.querySelectorAll('#more-button')
for (const more of mores) {
    more.addEventListener('click', e => {
        $err.spawn('This feature is yet to be added in the future version')
    })
}