import chokidar from 'chokidar'

// This module tracks file system
// and updates it if needed

class WatchTower {

    constructor() {
        // Create the main watcher variable
        this.watcher = chokidar.watch([], {
            depth: 0,
            ignoreInitial: true
        })

        // Add Event listeners
        watcher.on('add', this.onAdd)
        watcher.on('addDir', this.onAddDir)
        watcher.on('change', this.onChange)
        watcher.on('unlink', this.onUnlink)
        watcher.on('unlinkDir', this.onUnlinkDir)
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
    }

    // Create Dir event listener
    onAddDir(path, event) {
        console.log('Dir Created')
    }

    // Change File event listener
    onChange(path, event) {
        console.log('File Changed')
    }

    // Remove File event listener
    onUnlink(path, event) {
        console.log('File Removed')
    }
    
    // Remove Dir event listener
    onUnlinkDir(path, event) {
        console.log('Dir Removed')
    }
}

// Uncomment whenever you are ready
// window.watcher = new WatchTower()

