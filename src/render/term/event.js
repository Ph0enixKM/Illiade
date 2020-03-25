
// Open / Hide terminal when
// global state changes
TERMINAL_OPEN.trigger(val => {
    if (val) {
        termElem.style.visibility = 'hidden'
        termElem.style.transform = 'scale(0)'

        setTimeout(() => {
            termElem.style.visibility = 'visible'
            termElem.style.transform = 'scale(1)'
            TERMINALS.val[TERMINAL_ID.val].xterm.focus()
        }, 200)
    }

    else {
        termElem.style.visibility = 'visible'
        termElem.style.transform = 'scale(0)'
        
        setTimeout(() => {
            termElem.style.visibility = 'hidden'
            $('.inputarea').focus()
        }, 200)
    }
})

// Open terminal once clicked
// on the terminal button
termButton.addEventListener('click', e => {
    TERMINAL_OPEN.val = !TERMINAL_OPEN.val
})

// Open termnal when
// used shortcut
window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() == 't' && e.altKey) {
        TERMINAL_OPEN.val = !TERMINAL_OPEN.val
    }
})

// Recalculate terminal position
// in percents to pixels
function calcTermPixels(percentX, percentY) {
    return [
        window.innerWidth * percentX,
        window.innerHeight * percentY
    ]
}

// Terminal drag-with-mouse functionality
window.addEventListener('DOMContentLoaded', () => {
    window.drag = new Draggable(termElem, {
        limit: document.body,
        onDragEnd: val => {
            TERM_POS.val = [
                parseInt(val.style.left) / window.innerWidth,
                parseInt(val.style.top) / window.innerHeight
            ]
        }
    })
    
    // Set initial position
    drag.set(...calcTermPixels(...TERM_POS.val))
    
    // Listen to window resizal
    window.addEventListener('resize', e => {
        drag.set(...calcTermPixels(...TERM_POS.val))
        drag.setOption('limit', document.body)
    })
})

// Save terminal's position
// when it's changed
TERM_POS.trigger(val => {
    drag.set(...calcTermPixels(...TERM_POS.val))
    storage.set('TERM_POS', TERM_POS.val)
})