import path from 'path'

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

new Global('always', 'OPENED', {
    name: 'welcome', 
    fullpath: path.join(__dirname, '../../illiade.welcome'), 
    extension: 'welcome', 
    welcome: true,
    isVirtual: true
}, 'Opened file - holds HTML/Object Element')

new Global('always', 'TREE_MAP', [], 'Holds expanded tree map')
new Global('always', 'VIEWS_LAST', [], 'Holds last used views')
new Global('always', 'AMBIENT_SOUND', false, 'Turn on/off ambient sound')
new Global('always', 'COMMAND1', '', 'Command to use for a programmer')
new Global('always', 'COMMAND2', '', 'Command to use for a programmer')
new Global('always', 'COMMAND3', '', 'Command to use for a programmer')

new Global('brief', 'OPENED_LAST', [], 'Opened file - holds Objects')
new Global('brief', 'EDITOR_LOAD', false, 'Editor Loaded')
new Global('brief', 'TERMINAL_OPEN', false, 'If terminal is opened')
new Global('brief', 'VERSION', [1, 0], 'Illiade version')
new Global('brief', 'VERSION_LEVEL', 'ALPHA', 'Illiade version')
new Global('brief', 'FS_MOVE', null, 'Current Moving File')
new Global('brief', 'ICONS', [], 'Icons Array')
new Global('brief', 'EXT_UNSAVABLE', ['png', 'jpg', 'svg', 'welcome'], 'Non-savable extensions')
new Global('brief', 'SAVE_PROJECT_CONFIG', false, 'Save current configuration to .illiade project file')



