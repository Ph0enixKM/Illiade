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
    }

    // Remove File event listener
    onUnlink(path, event) {
        console.log('File Removed')
        TreeMaster.unlinkFile(path)
    }
    
    // Remove Dir event listener
    onUnlinkDir(path, event) {
        console.log('Dir Removed')
        TreeMaster.unlinkDir(path)
    }
}

// Uncomment whenever you are ready
window.watcher = new WatchTower()
