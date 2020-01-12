// Resizer of the file system panel
function viewResize () {
    let view = $('#view')
    let max = document.body.getBoundingClientRect()
    let fsWidth = fileSystem.getBoundingClientRect().width

    view.style.width = `calc(100vw - ${fsWidth}px)`
    window.editor.layout({width: max.width - fsWidth, height: max.height})
    updateResizer()
}

window.addEventListener('resize', viewResize)
new Resizer({
    element: fileSystem,
    resizer: $('#file-system #resizer'),
    x: true,
    y: false,
    on: viewResize
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