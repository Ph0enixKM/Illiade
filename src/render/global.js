import path from 'path'
import CargoDB from 'cargodb'

// Create a new global storage materia
const storage = new Storage(
    // CargoDB freaks him out
    // Update FS based on given files
    // -- Commented --
    // global.js:11

    new CargoDB('illiade-db', path.join(__dirname, '../../'))
)

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
new Global('always', 'TERM_X', 50, 'Terminal width')
new Global('always', 'TERM_Y', 20, 'Terminal height')
new Global('always', 'TERM_FONT_SIZE', 14, 'Terminal font size')
new Global('always', 'TERM_POS', [0.4, 0.4], 'Terminal position')
new Global('always', 'TERM_CURSOR_STYLE', 'Block', 'Style of terminal\'s cursor')
new Global('always', 'TERM_CURSOR_COLOR', '#CFB8AB', 'Color of terminal\'s cursor')
new Global('always', 'LEFT_PANEL_SIZE', 200, 'Size of the left panel')
new Global('always', 'BOOT_ANIMATION', true, 'Whether there should be any animation on boot')
new Global('always', 'BOOT_ANIMATION_TYPE', 0, 'Whether there should be any animation on boot')


new Global('brief', 'OPENED_LAST', [], 'Opened file - holds Objects')
new Global('brief', 'EDITOR_LOAD', false, 'Editor Loaded')
new Global('brief', 'TERMINAL_OPEN', false, 'If terminal is opened')
new Global('brief', 'VERSION', [1, 1], 'Illiade version')
new Global('brief', 'VERSION_LEVEL', 'Pillar', 'Illiade version')
new Global('brief', 'FS_MOVE', null, 'Current Moving File')
new Global('brief', 'ICONS', [], 'Icons Array')
new Global('brief', 'EXT_UNSAVABLE', ['png', 'jpg', 'svg', 'welcome'], 'Non-savable extensions')
new Global('brief', 'SAVE_PROJECT_CONFIG', false, 'Save current configuration to .illiade project file')
new Global('brief', 'TERMINALS', [], 'Terminal Objects')
new Global('brief', 'TERMINAL_ID', 0, 'Terminal chosen ID - used to get back to the terminal used before')
new Global('brief', 'TERMINAL_EDIT', false, 'Tells whether terminal is in edit mode')
new Global('brief', 'DEBUGGER_STYLE', 'color: #9a0187', 'Set the debugger style')



