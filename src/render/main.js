import fs from 'fs-extra'
import path from 'path'
import chokidar from 'chokidar'

tippy('[data-tippy-content]', {
    theme: 'dark',
    arrow: false,
    boundary: 'viewport',
    appendTo: document.body,
    placement: 'bottom'
})

// Load config project files
loadProjectConfig()

// Set focus on editor
EDITOR_LOAD.trigger(() => {
    setTimeout(() => {
        if (!EXT_UNSAVABLE.val.includes(OpenedAPI.get('extension'))) {
            $('.inputarea').focus()
        }
    }, 500)
})

window.addEventListener('DOMContentLoaded', () => {
    let version = document.querySelector('#version')
    version.innerHTML = VERSION_LEVEL.val
})

// Update All icons
fs.readdir(path.join(__dirname, '../../art/icons'), (err, files) => {
    files.forEach(file => {
        ICONS.push(file)
    })
})


fs.readdir(ROOT.val, (err, files) => {
    files.forEach(file => {
        if (file === '.illiade') {
            SAVE_PROJECT_CONFIG.val = true
        }
    })
})

// Update project config file (.illiade)
function updateProjectConfig() {
    const projectPath = path.join(ROOT.val, '.illiade')
    
    // Overwrite changes
    if (SAVE_PROJECT_CONFIG.val) {
        
        // Remove models and ensurance of existance
        const openedLast = OPENED_LAST.val.slice()
        for(let index = 0; index < openedLast.length; index++) {
            delete openedLast[index].model
            delete openedLast[index].exists
        }
        
        fs.writeFileSync(projectPath, JSON.stringify({
            TREE_MAP: TREE_MAP.val,
            OPENED_LAST: openedLast,
            VIEWS_LAST: VIEWS_LAST.val,
            COMMAND1: COMMAND1.val,
            COMMAND2: COMMAND2.val,
            COMMAND3: COMMAND3.val,
            OPENED: {
                isVirtual: true,
                name: OpenedAPI.get('name'),
                fullpath: OpenedAPI.get('fullpath'),
                extension: OpenedAPI.get('extension'),
                welcome: OPENED.val.welcome
            }
        }))
    }
    
    // Remove is should be non-existant
    else {
        if (fs.pathExistsSync(projectPath))
        fs.removeSync(projectPath)
    }
}

function loadProjectConfig() {
    const projectPath = path.join(ROOT.val, '.illiade')
    
    // Load if file exists
    if (fs.pathExistsSync(projectPath)) {
        let config = JSON.parse(fs.readFileSync(projectPath, 'utf-8'))
        TREE_MAP.val = config.TREE_MAP
        OPENED_LAST.val = config.OPENED_LAST
        VIEWS_LAST.val = config.VIEWS_LAST
        COMMAND1.val = config.COMMAND1
        COMMAND2.val = config.COMMAND2
        COMMAND3.val = config.COMMAND3
        OPENED.val = config.OPENED
        
        console.log(config.OPENED_LAST);
        console.log(OPENED_LAST.val);
    }
}

// Polyfill - return last element
Array.prototype.last = function () {
    return this[this.length - 1]
}
String.prototype.last = function () {
    return this[this.length - 1]
}

// Update file system
let treeNeedsUpdate = true
const watcher = chokidar.watch([], {
    depth: 0,
    ignoreInitial: true
})

watcher.on('add', watcherUpdate)
watcher.on('addDir', watcherUpdate)
watcher.on('unlink', watcherUpdate)
watcher.on('unlinkDir', watcherUpdate)

function watcherUpdate() {
    console.log(event, path)
    treeNeedsUpdate = true
}

setInterval(() => {
    if (treeNeedsUpdate) {
        updateTree()
        treeNeedsUpdate = false
    }
}, 1000)

// clear console
EDITOR_LOAD.trigger(() => {
    console.log(
        `%cIlliade ${VERSION_LEVEL.val}`,
        `   
            color: #BF00A8;
            font-family: Lato, Verdana;
            font-size: 30px;
        `
    )
})
