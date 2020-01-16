// ---
// All the File-System Related events
// ---

// Title bar update
OPENED.trigger((val, last) => {
    if (val == null || val == last) {
        title.innerHTML = 'Illiade'
        titleTip.setContent(`Illiade ${VERSION.val} ${VERSION_LEVEL.val}`)
        return
    }
    
    const fullpath = (val.isVirtual) 
        ? val.fullpath
        : val.getAttribute('fullpath')

    let filename = /\/([^/]*$)/.exec(fullpath)[1]
    title.innerHTML = filename
    titleTip.setContent(fullpath)

    

})

// Selecting files
OPENED.trigger((element, lastElement) => {        
    if (element == null || element.isVirtual) return
    
    // Deselect
    if (element === lastElement) {
        OPENED.quiet = null
        element.children[0].classList.remove('selected')
    }

    // Select
    else {
        element.children[0].classList.add('selected')
        if (lastElement != null && !lastElement.isVirtual)
            lastElement.children[0].classList.remove('selected')
    }
})


// Opening Files
OPENED.trigger(element => {
    // Open Welcome
    if (element == null) {
        view.open(null, null)
        return
    }
    
    if (element.isVirtual) {
        if (EDITOR_LOAD.val) {
            view.open(element.extension, element.fullpath)
        }
        else {
            EDITOR_LOAD.trigger(_ => view.open(element.extension, element.fullpath)) 
        }
    }

    // Open File
    else {
        let extension = element.getAttribute('extension')
        let fullpath = element.getAttribute('fullpath')
        view.open(extension, fullpath)
    }

})

// Menu "Change Directory" (button click)
changeDir.addEventListener('click', async e => {
    menu.on({
        title: 'Change root directory',
        subtitle: 'You can only write absolute path.',
        placeholder: '/home/',
        wide: true
    })

    menu.uploadHints(ROOTS.val)
    let inputDir = await menu.get()
    
    if (inputDir === null) return false
    TREE_MAP.val = []
    fsCont.innerHTML = ''
    changeDirectory(inputDir)
})

// Menu "Change Directory" (keyboard shortcut)
window.addEventListener('keydown', async e => {
    if (e.key.toLowerCase() == 'd' && e.altKey) {
        menu.on({
            title: 'Change root directory',
            subtitle: 'You can only write absolute path.',
            placeholder: '/home/',
            wide: true
        })
        
        menu.uploadHints(ROOTS.val)
        let inputDir = await menu.get()
        
        if (inputDir === null) return false
        TREE_MAP.val = []
        fsCont.innerHTML = ''
        changeDirectory(inputDir)
    }
})

// Menu "Change Directory" (init load)
window.onload = async () => {
    if (ROOT.val != null && ROOT.val.length !== 0) {
        updateTree()
    }
    OPENED.tick(OPENED.val)
}