// Global Class
class Global {
    constructor(kind, name, value, _description) {

        // If saved with the app
        if (kind === 'always') {
            storage.create(name, value)
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
new Global('always', 'FORMATS', ['cpp', 'mg'], 'All file formats supported')





