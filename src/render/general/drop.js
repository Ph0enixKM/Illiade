const dropElem = $('#drop')

// File drop mechanism.
// Drag and drop any file
// You want to open.
document.addEventListener('drop', e => {
    e.preventDefault()
    e.stopPropagation()

    // Make visible if it disappeared
    dropElem.style.visibility = 'visible'
    
    // You can't drag more than one file
    if (e.dataTransfer.files.length > 1) {
        msg.error('You can drag only one file or directory at once')
        dropElem.style.visibility = 'hidden'
        return null
    }

    // If dropped something that is not a file - hide back
    if (typeof e.dataTransfer.files[0] == 'undefined'){
        dropElem.style.visibility = 'hidden'
        return null
    }
    
    // Check whether the file really exists
    const fullpath = e.dataTransfer.files[0].path
    if (!fs.existsSync(fullpath)) {
        msg.error(`Requested file or directory '${fullpath}' does not exist`)
        dropElem.style.visibility = 'hidden'
    }
    
    // Local data
    const data = fs.statSync(fullpath)
    const isFile = data.isFile()
    const obj = OpenedAPI.extract(fullpath)

    // Open file
    if (isFile) {
        OPENED.val = obj
        storage.set('OPENED', OPENED.val)
    }

    // Open directory
    else {
        ROOT.val = fullpath
        fsCont.innerHTML = ''
        changeDirectory(ROOT.val)
    }

    // Animate filedrop
    const icon = document.querySelector('#drop #drop-icon')
    icon.classList.remove('no-file')
    
    // File Icon
    if (isFile) {
        if (ICONS.val.includes(`${obj.extension}-icon.svg`)) {
            icon.style.backgroundImage = `url(../../art/icons/${obj.extension}-icon.svg)`
        }   
        else {
            icon.style.backgroundImage = 'url(../../art/icons/file-icon.svg)'
        }
    }
    
    // Directory Icon
    else {
        icon.style.backgroundImage = 'url(../../art/icons/directory-icon.svg)'
    }

    // Hide drop field 
    // Atfter a second
    setTimeout(() => {
        dropElem.style.visibility = 'hidden'
        icon.classList.add('no-file')
    }, 1000)

})

// Drag
document.addEventListener('dragover', e => {
    e.preventDefault()
    e.stopPropagation()
})

// Drag Enter / Leave behavior
document.addEventListener('dragleave', dragExit)
document.addEventListener('dragenter', dragStart)

function dragStart() {
    // Must timeout because of Chromium bug
    setTimeout(() => {
        dropElem.style.visibility = 'visible'
        setTimeout(() => {
            dropElem.style.opacity = '1'
        }, 200)
    }, 10)    
}

function dragExit() {
    dropElem.style.opacity = '0'
    dropElem.style.visibility = 'hidden'
}