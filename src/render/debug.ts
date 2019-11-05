import { remote } from 'electron'

// Debug
export default class {

    private win: any

    constructor(isDebug: boolean) {

        this.win = remote.getCurrentWindow()

        if (isDebug) {
            window.addEventListener('keydown', e => {
                
                if (e.key == 'F5') {
                    location.reload()
                }

                else if (e.key == 'F6') {
                    this.win.toggleDevTools()
                }

            })
        }

    }
}