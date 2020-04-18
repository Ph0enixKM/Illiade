
// Update Tree Map in the storage
TREE_MAP.diverses(val => {
    storage.set('TREE_MAP', TREE_MAP.val)
})

// The main center object
// to manipulate file system

class TreeMaster {
    constructor() {
        this.pointer = [0]
        
        // Go to file system
        new Shortcut('ALT F', e => {
            FS_SCOPE.val = !FS_SCOPE.val
            
        })

        // Button to get out of the edit mode
        $('#fs-scope-lock .close').addEventListener('click', e => {
            FS_SCOPE.val = false
        })

        // On FS_SCOPE change
        FS_SCOPE.trigger(val => {
            if (val) {
                this.selectFile()
                $('.inputarea').blur()
                $('#fs-scope-lock').classList.add('on')
                fsCont.children[0].focus()
            }
            else {
                this.deselectFile()
                $('#fs-scope-lock').classList.remove('on')
                $('.inputarea').focus()
            }
        })

        // Menu hooks
        menu.turnedOn(val => {
            this.deselectFile()
        })
        menu.turnedOff(val => {
            if (FS_SCOPE.val) this.selectFile()
        })
        
        // Keyboard manipulate fs
        window.addEventListener('keydown', e => {
            // Prevent default when in FS mode
            if (FS_SCOPE.val) {
                if([32, 37, 38, 39, 40].indexOf(e.keyCode) >= 0)
                    e.preventDefault()
            }
            // Run on next frame paint
            setImmediate(() => {
                if (FS_SCOPE.val) {

                    // Entering directories
                    if (e.key === 'ArrowRight' && !e.altKey) {
                        const file = this.getFile()
                        if (!file.classList.contains('expanded')) {
                            TreeMaster.clickEvent(this.getFile())
                            if (file.getAttribute('type') === 'file') {
                                FS_SCOPE.val = false
                            }
                        }
                        setTimeout(() => { this.enterDir() }, 100)
                    }

                    // Leaving directories
                    else if (e.key === 'ArrowLeft' 
                    && !e.altKey) {
                        this.leaveDir()
                    }

                    // Move down
                    else if (e.key === 'ArrowDown' 
                    && !e.altKey) {
                        this.moveDown()
                    }

                    // Move up
                    else if (e.key === 'ArrowUp' 
                    && !e.altKey) {
                        this.moveUp()
                    }
                    
                    // Fold directory
                    else if (e.key.toLowerCase() === 'f' && !e.altKey) {
                        const file = this.getFile()
                        if (file.getAttribute('type') === 'dir')
                            TreeMaster.clickEvent(this.getFile())
                    }

                    // Remove directory or file
                    else if (e.key === 'Delete' && !e.altKey) {
                        const file = this.getFile()
                        const name = OpenedAPI.get('name', file)
                        decision.spawn(
                            `Are you sure you want to delete <br>${name}?`,
                        answer => {
                            // Attempt removing
                            if (answer) {
                                this.getFile().dispatchEvent(events.unlink)
                                if (this.pointer.last() > 0) {
                                    this.deselectFile()
                                    this.pointer[this.pointer.length-1]--
                                    this.selectFile()
                                }
                                else {
                                    this.leaveDir()
                                }
                            }
                        })
                    }

                    // Create directory
                    else if (e.key.toLowerCase() === 'q' && !e.altKey) {
                        this.getFile().dispatchEvent(events.newDir)
                    }

                    // Create file
                    else if (e.key.toLowerCase() === 'e' && !e.altKey) {
                        this.getFile().dispatchEvent(events.newFile)
                    }

                    // Duplicate directory or file
                    else if (e.key.toLowerCase() === 'd' && !e.altKey) {
                        const file = this.getFile()
                        const name = OpenedAPI.get('name', file)
                        decision.spawn(`Do you want to duplicate file '${name}'?`, answer => {
                            if (answer) {
                                this.deselectFile()
                                this.getFile().dispatchEvent(events.duplicate)
                                setTimeout(() => {
                                    this.selectFile()
                                }, 100)
                            }
                        })
                    }

                    // Move directory or file
                    else if (e.key.toLowerCase() === 'm' && !e.altKey) {
                        // Start moving file
                        if (FS_MOVE.val === null) {
                            this.getFile().dispatchEvent(events.move)
                        }
                        // End Moving file
                        else {
                            const file = this.getFile()
                            const ptr = this.pointer
                            let isFile = false
                            // Paste to the parent
                            if (file.getAttribute('type') === 'file') {
                                this.deselectFile()
                                this.pointer = ptr.slice(0, -1)
                                isFile = true
                            }
                            // Move the file
                            FS_SCOPE_MOVE.val = true
                            TreeMaster.clickEvent(this.getFile())
                            FS_SCOPE_MOVE.val = false
                            // Move back to the file
                            if (isFile) {
                                this.pointer = ptr
                                this.selectFile()
                            }
                        }
                    }

                    // Rename directory or file
                    else if (e.key === 'F2' && !e.altKey) {
                        this.getFile().dispatchEvent(events.rename)
                    }

                }
            })
        })
    }

    // --> Keyboard Movement Methods <--

    // Enter directory
    enterDir() {
        const file = this.getFile()
        const type = file.getAttribute('type')
        if (type === 'dir') {
            if (file.children[1].children.length > 0) {
                this.deselectFile()
                this.pointer.push(0)
                this.selectFile()
            }
        }
    }

    // Leave directory
    leaveDir() {
        const file = this.getFile()
        const type = file.getAttribute('type')
        if (this.pointer.length > 1) {
            this.deselectFile()
            this.pointer.pop()
            this.selectFile()
        }
    }

    // Move up a file
    moveUp() {
        const file = this.getFile()
        if (this.pointer.last() > 0) {
            this.deselectFile()
            this.pointer[this.pointer.length-1]--
            this.selectFile()
        }
    }

    // Move down a file
    moveDown() {
        const file = this.getFile()
        if (file.nextSibling) {
            this.deselectFile()
            this.pointer[this.pointer.length-1]++
            this.selectFile()
        }
    }

    selectFile() {
        const file = this.getFile()
        const pos = file.offsetTop - (window.innerHeight / 2)
        file.style.color = 'rgb(255, 51, 106)'
        fileSystem.scrollTop = pos
    }

    deselectFile() {
        this.getFile().style.color = '#888'
    }


    // Get currently selected file
    getFile() {
        let i = 1
        let failed = false
        let file = fsCont.children[this.pointer[0]]
        // Main loop
        for (const index of this.pointer.slice(1)) {
            if(file.classList.contains('expanded')) {
                const parent = file.children[1].children[index]
                // If someone removed the file
                if (parent === undefined) {
                    failed = true
                    break
                }
                file = parent
                i++
            }
            // Go up a directory
            // If current dir has folded up
            else {
                failed = true
                break
            }
        }
        // Once failed to open the file
        if (failed) this.pointer = this.pointer.slice(0, i)
        return file
    }


    // Click event simulator
    static clickEvent(element) {
        const clickEvent = document.createEvent("MouseEvents")
        clickEvent.initMouseEvent(
            "click", true, true, window, 
            1, 0, 0, 0, 0, false, false, 
            false, false, 0, null
        )
        element.dispatchEvent(clickEvent)
    }


    // --> Static Watcher Methods <--

    // Updates for a file if it was added
    // given the specified path
    static async addFile(txtPath) {
        const base = path.dirname(txtPath)
        const addedName = path.basename(txtPath)
        const file = new File(base, addedName).getElement()
        const items = fs.readdirSync(base)
        const files = []
        // Get parent if possible
        let parent = document.querySelector(`[fullpath="${base}"]`)
        // Scream and shout
        if (parent == null) {
            console.warn(
                'Tree Master (AddFile)' +
                'Cannot find file: ' + base
            )
            return null
        }
        // Get the files element 
        // which holds all the files
        parent = parent.children[1]
        // Get only files from all items
        for (const item of items) {
            if (!await checkFileStats(base, item)) {
                files.push(item)
            }
        }
        // Get index of the desired file
        const index = files.indexOf(addedName)
        // If there are some 
        // files already
        if (files.length > 1) {
            // If it's a first file
            // Insert it after the last
            // directory and before
            // the gui-wise first file
            if (index == 0) {
                const sibling = document.querySelector(
                    `[fullpath="${path.join(base, files[index + 1])}"]`
                )
                return parent.insertBefore(file, sibling) 
            }
            // Get a sibling of desired 
            // file in the correct order
            const sibling = document.querySelector(
                `[fullpath="${path.join(base, files[index - 1])}"]`
            )
            // If there is not next file
            // It's the last file
            if (sibling.nextSibling == null) {
                parent.append(file)    
            }
            // Otherwise add before
            // the next file
            else {
                parent.insertBefore(file, sibling.nextSibling)
            }
        }
        // No files?
        // Add to the end
        else {
            parent.append(file)
        }
    }


    // Updates for a directory if it 
    // was added given the specified path
    static async addDir(txtPath) {
        const base = path.dirname(txtPath)
        const addedName = path.basename(txtPath)
        const dir = new Directory(base, addedName).getElement()
        const items = fs.readdirSync(base)
        const dirs = []
        // Get parent if possible
        let parent = document.querySelector(`[fullpath="${base}"]`)
        // Scream and shout
        if (parent == null) {
            console.warn(
                'Tree Master (AddDir)' +
                'Cannot find dir: ' + base
            )
            return null
        }
        // Get the files element 
        // which holds all the files
        parent = parent.children[1]
        // Get only directories from all items
        for (const item of items) {
            if (await checkFileStats(base, item)) {
                dirs.push(item)
            }
        }
        // Get index of the desired dir
        const index = dirs.indexOf(addedName)
        console.log(dirs.length, index)
        // If there are some 
        // directories already
        if (index > 0) {
            // If it's the last directory file
            if (index + 1 == dirs.length) {
                parent.append(dir)
            }
            // Get a sibling of desired 
            // file in the correct order
            const sibling = document.querySelector(
                `[fullpath="${path.join(base, dirs[index - 1])}"]`
            )
            // If there is not next dir
            // It's the last dir (and there are no files)
            if (sibling.nextSibling == null) {
                parent.prepend(dir)    
            }
            // Otherwise add before
            // the next directory
            else {
                parent.insertBefore(dir, sibling.nextSibling)
            }
        }
        // No dirs?
        // Add to the beginning
        else {
            parent.prepend(dir)
        }
    }

    
    // Updates for a file if it was unlinked 
    // (removed) with given specified path
    static async unlinkFile(txtPath) {
        const file = document.querySelector(`[fullpath="${txtPath}"]`)
        // Scream and shout
        if (file == null) {
            console.warn(
                'Tree Master (UnlinkFile)' +
                'Cannot find file: ' + txtPath
            )
            return null
        }
        // The main topic here
        file.remove()
    }

    // Updates for a file if it was unlinked 
    // (removed) with given specified path
    static async unlinkDir(txtPath) {
        const dir = document.querySelector(`[fullpath="${txtPath}"]`)
        // Scream and shout
        if (dir == null) {
            console.warn(
                'Tree Master (UnlinkDir)' +
                'Cannot find dir: ' + txtPath
            )
            return null
        }
        // The main topic here
        dir.remove()
    }

}

EDITOR_LOAD.trigger(() => {
    setTimeout(() => {
        new TreeMaster()
    }, 1000)
})

// This function regenerated the whole FileSystem
function updateTree() {
    const fullpath = OpenedAPI.get('fullpath')
    const name = OpenedAPI.get('name')

    let exists = fs.existsSync(fullpath)
    if (!exists) {
        titleTip.setContent(`${fullpath} (deleted)`)
        title.innerHTML = `<span class="deleted">${name}</span>`
    }

    // Reload file system
    fsCont.style.opacity = 0
    setTimeout(async () => {

        fsCont.innerHTML = ''
        await changeDirectory(ROOT.val)

        setTimeout(() => {
            fsCont.style.opacity = 1
        }, 100)
    }, 100)
}

// Pass basedir and filename to check whether the file is
// a directory or pass just a directory for fullpath check
async function checkFileStats(directory, file = null) {
    return new Promise(res => {
        let thepath = path.join(directory, file)
        if (file == null) {
            thepath = directory
        }
        fs.stat(path.join(directory, file), (err, stats) => {
            if (err) return res(null)            
            return res(stats.isDirectory())
        })
    })
}

// This function generates file system tree
async function generateTree(container, givenFiles, directory) {
    // let isDirs = []
    const dirs = []
    const files = []

    
    for (const file of givenFiles) {
        let isdir = await checkFileStats(directory, file)
        
        if (isdir) 
            dirs.push(file)
        else 
            files.push(file)
    }

    for (const dir of dirs) {
        let isExpanded = false
        if (TREE_MAP.val.includes(path.join(directory, dir)))
            isExpanded = true
            
        let d = new Directory(directory, dir, isExpanded)
        container.appendChild(d.getElement())
    }

    for (const file of files) {
        let f = new File(directory, file)
        container.appendChild(f.getElement())
    }
    
    // files.forEach((value, index) => {
    //     if (isDirs[index] === null) return

    //     if (isDirs[index]) {
    //         let isExpanded = false
            
    //         if (TREE_MAP.val.includes(path.join(directory, value)))
    //             isExpanded = true
                
    //         let dir = new Directory(directory, value, isExpanded)
    //         container.appendChild(dir.getElement())
    //     }

    //     else {
    //         let file = new File(directory, value)
    //         container.appendChild(file.getElement())
    //     }
    // })

    updateResizer()
}