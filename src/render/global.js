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

new Global('always', 'OPENED', null, 'Opened file - holds HTML Element')
new Global('always', 'TREE_MAP', [], 'Holds expanded tree map')
new Global('always', 'VIEWS_LAST', [], 'Holds last used views')

new Global('brief', 'OPENED_LAST', [], 'Opened file - holds Objects')
new Global('brief', 'EDITOR_LOAD', false, 'Editor Loaded')
new Global('brief', 'TERMINAL_OPEN', false, 'If terminal is opened')
new Global('brief', 'VERSION', [1, 0], 'Illiade version')
new Global('brief', 'VERSION_LEVEL', 'ALPHA', 'Illiade version')
new Global('brief', 'FS_MOVE', null, 'Current Moving File')
new Global('brief', 'ICONS', [], 'Icons Array')




