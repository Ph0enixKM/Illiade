
// Update Tree Map in the storage
TREE_MAP.diverses(val => {
    storage.set('TREE_MAP', TREE_MAP.val)
})

// The main center object
// to manipulate file system

class TreeMaster {
    constructor() {
        

    }


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
                parent.prepend()
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

        // If there are some 
        // directories already
        if (index > 0) {
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