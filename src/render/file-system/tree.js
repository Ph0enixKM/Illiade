
// Update Tree Map in the storage
TREE_MAP.diverses(val => {
    storage.set('TREE_MAP', TREE_MAP.val)
})

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

// This function generates file system tree
async function generateTree(container, givenFiles, directory) {
    // let isDirs = []
    const dirs = []
    const files = []

    // Avoid this way stack overflow
    async function checkFileStats(directory, file) {
        return new Promise(res => {
            fs.stat(path.join(directory, file), (err, stats) => {
                if (err) return res(null)            
                return res(stats.isDirectory())
            })
        })
    }
    
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