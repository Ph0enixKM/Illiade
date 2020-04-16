import chokidar from 'chokidar'

// This module tracks file system
// and updates it if needed

class WatchTower {

    constructor() {
        // Create the main watcher variable
        this.watcher = chokidar.watch(ROOT.val, {
            depth: 0,
            ignoreInitial: true
        })

        // Add Event listeners
        this.watcher.on('add', this.onAdd)
        this.watcher.on('addDir', this.onAddDir)
        this.watcher.on('change', this.onChange)
        this.watcher.on('unlink', this.onUnlink)
        this.watcher.on('unlinkDir', this.onUnlinkDir)
    }

    // Add paths to the watcher idea
    // so that it keeps track on the
    // newly discovered files.
    link(...paths) {
        this.watcher.add(...paths)
    }


    // Remove paths from the watcher
    // idea so that it no longer has
    // to keep track on them.
    free(...paths) {
        this.watcher.add(...paths)
    }

    // Create File event listener
    onAdd(path, event) {
        console.log('File Created')
        TreeMaster.addFile(path)
    }

    // Create Dir event listener
    onAddDir(path, event) {
        console.log('Dir Created')
        TreeMaster.addDir(path)
    }

    // Change File event listener
    onChange(path, event) {
        console.log('File Changed')
        // Reload when file is saved 
        // and it has changed in the background
        OPENED_LAST.val.find(item => {
            if (item.fullpath != path) return null
            // If it's a saved file
            if (!item.unsaved && !JUST_SAVED_FILE.val) {
                item.model.setValue(fs.readFileSync(path, 'utf-8'))
                // Restore view state to put the cursor
                // In the right position
                if (path == OpenedAPI.get('fullpath')) {
                    restoreViewState(path)
                }
                return
            }
            console.log('unsaved')
            // If it's an unsaved file
            if (item.unsaved && !JUST_SAVED_FILE.val) {
                let obj = OpenedAPI.extract(path)
                decision.spawn(`
                    File ${obj.name} has changed in the background, 
                    but you have applied some changes to it.
                    Do you want to reload and wipe the changes?<br>
                    (Answering 'no' will overwrite with changes appied in Illiade)
                    <br><br>Detailed path: (${path})
                `, answer => {
                    if (answer) {
                        item.model.setValue(fs.readFileSync(path, 'utf-8'))
                    }
                    else {
                        setTimeout(() => saveFileTitleUpdate(path), 10)
                    }
                    // Restore view state to put the cursor
                    // In the right position
                    if (path == OpenedAPI.get('fullpath')) {
                        setTimeout(saveFileTitleUpdate, 10)
                        restoreViewState(path)
                    }
                })
            }
        })
    }

    // Remove File event listener
    onUnlink(path, event) {
        console.log('File Removed')
        TreeMaster.unlinkFile(path)
        TabsManager.removeFromTabs(path)
        if (path == OpenedAPI.get('fullpath')) {
            $('#title').classList.add('deleted')
            $('#editor').classList.add('deleted')
        }
    }
    
    // Remove Dir event listener
    onUnlinkDir(path, event) {
        console.log('Dir Removed')
        TreeMaster.unlinkDir(path)
    }
}

// Uncomment whenever you are ready
window.watcher = new WatchTower()

