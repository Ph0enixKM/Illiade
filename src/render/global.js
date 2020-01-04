// Global Class
class Global {
    constructor(kind, name, value, _description) {

        // If saved with the app
        if (kind === 'always') {
            let exists = storage.create(name, value)
            if (!exists) {
                value = storage.get(name)
            }
            window[name] = new Variable(value)
        }

        // If saved in the project file
        else if (kind === 'stored') {
            // TODO
        }

        // If saved in current session memory
        else if (kind === 'brief') {
            window[name] = new Variable(value)
        }
        else throw 'Invalid kind'
    
    }
}


// ---
// Global variables
// ---


new Global('always', 'ROOT', '', 'Current root diretory')
new Global('always', 'ROOTS', [], 'Used root directories')
new Global('always', 'FORMATS', ['cpp', 'mg', 'png', 'jpg', 'svg'], 'All file formats supported')
new Global('always', 'OPENED', null, 'Opened file - holds HTML Element')

new Global('brief', 'EDITOR_LOAD', false, 'Editor Loaded')
new Global('brief', 'TERMINAL_OPEN', false, 'If terminal is opened')





