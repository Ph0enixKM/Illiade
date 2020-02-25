import { pathExists } from "fs-extra"

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

    const fullpath = OpenedAPI.get('fullpath')

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
OPENED.trigger((element, lastElement) => {
    // Open Welcome
    if (element == null) {
        view.open(null, null)
        return
    }
    
    if (element.isVirtual) {
        if (EDITOR_LOAD.val) {
            updateOpenedFiles({
                extension: element.extension,
                fullpath: element.fullpath,
                name: element.name
            }, OpenedAPI.get('fullpath', lastElement))
        }
        else {
            EDITOR_LOAD.trigger(_ => {
                updateOpenedFiles({  
                    extension: element.extension,
                    fullpath: element.fullpath,
                    name: element.name
                }, OpenedAPI.get('fullpath', lastElement))
            }) 
        }
        
    }

    // Open File
    else {
        
        let extension = element.getAttribute('extension')
        let fullpath = element.getAttribute('fullpath')
        
        updateOpenedFiles({
            extension,
            fullpath,
            name: element.getAttribute('name'),
        }, OpenedAPI.get('fullpath', lastElement))
        
        updateChanges()
    }

})

// Save State View
setInterval(() => {
    saveViewState(OPENED.val.fullpath)
}, 3000)

function saveViewState(fullpath) {
    let found = false
    // Save Last element's view state
    for (const [index, obj] of VIEWS_LAST.val.entries()) {        
        if (obj.fullpath == fullpath) {
            VIEWS_LAST.val[index].viewState = editor.saveViewState()
            storage.set('VIEWS_LAST', VIEWS_LAST.val)
            found = true
            break
        }
    }
    
    if(!found) {
        VIEWS_LAST.push({
            fullpath,
            viewState: editor.saveViewState()
        })
        storage.set('VIEWS_LAST', VIEWS_LAST.val)
    }
}

function restoreViewState(fullpath) {
    // Save Last element's view state
    for (const obj of VIEWS_LAST.val) {        
        if (obj.fullpath == fullpath) {
            editor.restoreViewState(obj.viewState)
            break
        }
    }
}

function updateOpenedFiles(element, lastElPath) {
    let isNonText = EXT_UNSAVABLE.val.includes(element.extension)
    let model = null
    
    if (element.fullpath != lastElPath && !isNonText)
        saveViewState(lastElPath)
    
    // Choose the opened file
    for (const [index, obj] of OPENED_LAST.val.entries()) {        
        if (obj.fullpath == element.fullpath) {
            model = obj
            OPENED_LAST.val.splice(index, 1)
            break
        }
    }
    
    
    if (model) {
        if (model.image) {
            view.open(model.extension, model.fullpath)
        }
        else {
            view.open(model.extension, model.fullpath)
            editor.setModel(model.model)
            restoreViewState(model.fullpath)
        }
    }
    
    else {
        let file = fs.readFileSync(element.fullpath, 'utf-8')
        
        model = {
            extension: element.extension,
            fullpath: element.fullpath,
            name: element.name,
            isVirtual: true,
            image: isNonText
        }
        
        if (model.image) {
            view.open(model.extension, model.fullpath)
        }
        else {
            model.language = view.open(model.extension, model.fullpath)
            model.model = monaco.editor.createModel(file, model.language)
            editor.setModel(model.model)
            
            restoreViewState(model.fullpath)
            saveViewState(model.fullpath)
        }
    }
    
    
    OPENED_LAST.unshift(model)
    
    if (OPENED_LAST.val.length > 15) {
        OPENED_LAST.val = OPENED_LAST.val.slice(0, 15)
    }
}

// Check if file content changed
$('#editor').addEventListener('keyup', async e => updateChanges())

async function updateChanges() {
    const extension = OpenedAPI.get('extension')
    const savedIcon = document.querySelector('#title-cont #saved')
    const fullpath = OpenedAPI.get('fullpath')
    const unsaved = editor.getValue()
    
    // Avoid unsavable extensions
    if (EXT_UNSAVABLE.val.includes(extension)) {
        savedIcon.style.visibility = 'hidden'
        return
    }

    if (!await pathExists(fullpath)) return
    fs.readFile(fullpath, 'utf-8', (err, saved) => {
        if (err) throw err
        
        if (saved != unsaved) {
            savedIcon.style.visibility = 'visible'
        }

        else {
            savedIcon.style.visibility = 'hidden'
        }
    })
}



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
    if (e.key.toLowerCase() == 'r' && e.altKey) {
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

// Save File (button)
$('#title-cont #saved').addEventListener('click', e => {
    const fullpath = OpenedAPI.get('fullpath')

    fs.writeFileSync(fullpath, editor.getValue())
    e.target.style.visibility = 'hidden'

    updateTree()
})

// Save File (keyboard shortcut)
window.addEventListener('keydown', async e => {
    if (e.key.toLowerCase() == 's' && e.ctrlKey) {
        const fullpath = OpenedAPI.get('fullpath')

        fs.writeFileSync(fullpath, editor.getValue())
        $('#title-cont #saved').style.visibility = 'hidden'

        updateTree()
    }
})