import { remote } from "electron"
import fs from 'fs-extra'

cliInit()

// Run the CLI interface
// use 'illiade' or 'illie'
// and pass desired flags
function cliInit() {
    const cliPath = remote.process.argv[1]

    // Report path to debugger
    EDITOR_LOAD.trigger(() => console.log(
        `%ccli-path: ${cliPath}`, DEBUGGER_STYLE.val
    ))
    
    
    if (cliPath != null) {
        let thePath = ''

        // Path to pointed file / directory
        if (cliPath[0] == '.') {
            thePath = path.join(remote.process.cwd(), cliPath)
        }
        else {
            thePath = cliPath
        }
        
        // Check if file exists
        if (!fs.existsSync(thePath)) {
            msg.error(`Requested file or directory '${thePath}' does not exist`)
            return null
        }
        
        const data = fs.statSync(thePath)
        const isFile = data.isFile()
        
        
        // Open here
        if (cliPath.trim() == '.') {
            ROOT.val = thePath
            changeDirectory(ROOT.val)
        }
        
        
        // Open file case
        if(isFile) {
            setTimeout(() => {
                OPENED.val = OpenedAPI.extract(thePath)
                storage.set('OPENED', OPENED.val)
            }, 550)
        }
        
        // Open ROOT directory case
        else {
            ROOT.val = thePath
            fsCont.innerHTML = ''
            changeDirectory(ROOT.val)
        }
        
        
    }
}
