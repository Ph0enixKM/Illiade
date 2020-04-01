const DB = []

// Creates a global shortcut
// and runs a given callback
// whenever executed.
export default class Shortcut {
    // Create a custom shortcut using
    // space separated accelerator.
    // Example: CTRL + ALT + T
    constructor(shortcut, callback, force = false) {
        this.cmd = shortcut.trim()
        this.codes = shortcut.split(/\s+/)
        
        // Local variables
        let ctrl = false
        let alt = false
        let shift = false
        let key = ''
        
        // Parse the accelerator
        for (const code of this.codes) {
            if (code === 'CTRL') ctrl = true
            else if (code === 'ALT') alt = true
            else if (code === 'SHIFT') shift = true
            else {
                if (key != '') console.warn(
                    `Warning! Only the last key will be registered in '${shortcut}'.`
                )
                key = code
            }
        }

        // Generate a unique id
        let id = ''
        id += (ctrl) ? '|' : '-'
        id += (alt) ? '|' : '-'
        id += (shift) ? '|' : '-'
        id += `(${key})`

        // Check whether the accelerator exists
        if (DB.includes(id) && !force) {
            throw `Such accelerator '${shortcut}' already exists.`
        }

        // Assign the shortcut to the window
        window.addEventListener('keydown', e => {
            const reqs = [false, false, false, false]

            // Key match
            if (key) {
                if (e.key.toLowerCase() === key.toLowerCase())
                    reqs[0] = true
            }
            else reqs[0] = true

            // Ctrl, alt and shift key match
            if (e.ctrlKey === ctrl) reqs[1] = true
            if (e.altKey === alt) reqs[2] = true
            if (e.shiftKey === shift) reqs[3] = true
            
            // When failed
            if (reqs.includes(false)) return null

            // Run callback
            callback(e)

        })
    }
}

