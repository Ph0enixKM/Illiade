const dropElem = $('#drop')

// Drop mechanism
document.addEventListener('drop', e => {
    e.preventDefault()
    e.stopPropagation()
    dropElem.style.visibility = 'visible'

    console.log(e.dataTransfer.files);
    
    if (e.dataTransfer.files.length > 1) {
        $err.spawn('You can drag only one file or directory at once')
        dropElem.style.visibility = 'hidden'
        return null
    }

    const fullpath = e.dataTransfer.files[0].path
    if (!fs.existsSync(fullpath)) {
        $err.spawn(`Requested file or directory '${fullpath}' does not exist`)
        dropElem.style.visibility = 'hidden'
    }
    
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

// document.addEventListener('dragexit', dragExit)
document.addEventListener('dragleave', dragExit)
// document.addEventListener('dragstart', dragStart)
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