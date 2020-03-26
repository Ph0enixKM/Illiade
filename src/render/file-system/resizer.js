
// Load the left panel width
// And make that cool animation
EDITOR_LOAD.trigger(() => {
    let view = $('#view')
    let max = document.body.getBoundingClientRect()
    
    // Animate panel
    if (BOOT_ANIMATION.val) {
        const beziers = [
            'cubic-bezier(.11,.65,.27,.93)', // Silk
            'cubic-bezier(.96,.53,.27,.93)', // Papyrus
            'cubic-bezier(.85,.18,.7,1)' // Feather
        ]
        
        fileSystem.style.transition = `700ms ${beziers[BOOT_ANIMATION_TYPE.val]}`

        setTimeout(() => {
            view.style.width = `calc(100vw - ${LEFT_PANEL_SIZE.val}px)`
            window.editor.layout({width: max.width - LEFT_PANEL_SIZE.val, height: max.height - 58})
            fileSystem.style.width = LEFT_PANEL_SIZE.val + 'px'
            fileSystem.style.opacity = '1'

            setTimeout(() => {
                viewResize()
                fileSystem.style.transition = '0ms'
            }, 1000)
        }, 100)
    }

    // Don't animate panel
    else {
        view.style.width = `calc(100vw - ${LEFT_PANEL_SIZE.val}px)`
        window.editor.layout({width: max.width - LEFT_PANEL_SIZE.val, height: max.height - 58})
        fileSystem.style.width = LEFT_PANEL_SIZE.val + 'px'
        fileSystem.style.opacity = '1'
        viewResize()
    }
})

// Updates all the content
// To match the new size
function viewResize () {
    let view = $('#view')
    let max = document.body.getBoundingClientRect()
    let fsWidth = fileSystem.getBoundingClientRect().width

    view.style.width = `calc(100vw - ${fsWidth}px)`
    window.editor.layout({width: max.width - fsWidth, height: max.height - 58})
    updateResizer()
    storage.set('LEFT_PANEL_SIZE', fsWidth)
}

window.addEventListener('resize', viewResize)
new Resizer({
    element: fileSystem,
    resizer: $('#file-system #resizer'),
    x: true,
    y: false,
    on: viewResize,
    xLimits: [20, 500]
})

// Reshape Resizer to match height of tree
function updateResizer() {
    let resizer = $('#file-system #resizer')
    let minHeight = fileSystem.getBoundingClientRect().height
    let treeHeight = fsCont.getBoundingClientRect().height
    let panelHeight = panel.getBoundingClientRect().height
    let safe = 10
    resizer.style.height = `${treeHeight + panelHeight + safe}px`
    if (minHeight > treeHeight) {
        resizer.style.height = `${minHeight + safe}px`
    }
}